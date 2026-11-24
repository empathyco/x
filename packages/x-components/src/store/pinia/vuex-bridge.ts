import type { Dictionary } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { AnyPiniaStore, XStoreBridge } from './define-x-store'
import { toRaw } from 'vue'

/**
 * Vuex internals that are not typed by the library.
 *
 * @internal
 */
interface VuexStoreInternals {
  _withCommit: (fn: () => void) => void
  strict?: boolean
}

/**
 * Checks if the Vuex store has been created in strict mode.
 *
 * @param store - The Vuex store.
 * @returns True if the store is strict.
 * @internal
 */
export function isStrictStore(store: Store<any>): boolean {
  return (store as unknown as VuexStoreInternals).strict === true
}

/**
 * Registers a Vuex module under `x/<name>` that exposes a Pinia store, so the code that still
 * reads from Vuex keeps working. The Vuex state is the very same reactive object that Pinia holds.
 * Mutations and actions are delegated to the Pinia actions.
 *
 * @param store - The Vuex store.
 * @param name - The name of the module.
 * @param piniaStore - The Pinia store to expose.
 * @param bridge - The Pinia actions exposed as Vuex mutations and actions.
 * @param getterNames - The names of the Pinia getters to expose.
 * @internal
 */
export function bridgePiniaModule(
  store: Store<any>,
  name: string,
  piniaStore: AnyPiniaStore,
  bridge: XStoreBridge,
  getterNames: string[],
): void {
  const callAction = (actionName: string, payload: unknown): unknown =>
    (piniaStore as Dictionary<(payload: unknown) => unknown>)[actionName](payload)

  store.registerModule(['x', name], {
    namespaced: true,
    state: () => piniaStore.$state,
    getters: Object.fromEntries(
      getterNames.map(getterName => [getterName, () => piniaStore[getterName]]),
    ),
    mutations: Object.fromEntries(
      Object.entries(bridge.mutations).map(([vuexName, actionName]) => [
        vuexName,
        (_state: unknown, payload: unknown) => {
          callAction(actionName, payload)
        },
      ]),
    ),
    actions: Object.fromEntries(
      Object.entries(bridge.actions).map(([vuexName, actionName]) => [
        vuexName,
        (_context: unknown, payload: unknown) => callAction(actionName, payload),
      ]),
    ),
  })
}

interface ReplaceStateLinks {
  piniaStores: Map<string, AnyPiniaStore>
  restore: () => void
}

const linksByStore = new WeakMap<Store<any>, ReplaceStateLinks>()

/**
 * Makes `store.replaceState` aware of the Pinia stores bridged to Vuex. Vuex replaces the whole
 * root state, which would leave `store.state.x.<name>` detached from the Pinia state. After the
 * replacement, the incoming module state is copied into the Pinia store, and the Vuex state is
 * linked again to the Pinia one. The `replaceState` function is only wrapped once per store, and it
 * is restored when the last link is removed.
 *
 * @param store - The Vuex store.
 * @param name - The name of the module.
 * @param piniaStore - The Pinia store to link.
 * @returns A function to remove the link.
 * @internal
 */
export function linkReplaceState(
  store: Store<any>,
  name: string,
  piniaStore: AnyPiniaStore,
): () => void {
  let links = linksByStore.get(store)
  if (!links) {
    links = createReplaceStateLinks(store)
    linksByStore.set(store, links)
  }
  const currentLinks = links
  currentLinks.piniaStores.set(name, piniaStore)

  return () => {
    if (currentLinks.piniaStores.get(name) === piniaStore) {
      currentLinks.piniaStores.delete(name)
    }
    if (currentLinks.piniaStores.size === 0 && linksByStore.get(store) === currentLinks) {
      currentLinks.restore()
      linksByStore.delete(store)
    }
  }
}

/**
 * Wraps the `replaceState` function of a Vuex store.
 *
 * @param store - The Vuex store.
 * @returns The Pinia stores linked and the function to restore the original `replaceState`.
 * @internal
 */
function createReplaceStateLinks(store: Store<any>): ReplaceStateLinks {
  const piniaStores = new Map<string, AnyPiniaStore>()
  const hadOwnReplaceState = Object.prototype.hasOwnProperty.call(store, 'replaceState')
  // eslint-disable-next-line ts/unbound-method
  const originalReplaceState = store.replaceState

  const wrappedReplaceState = (state: any): void => {
    originalReplaceState.call(store, state)
    // eslint-disable-next-line ts/no-unsafe-member-access
    const incomingModules = state?.x as Dictionary<object | undefined> | undefined
    piniaStores.forEach((piniaStore, name) => {
      const incoming = incomingModules?.[name]
      if (incoming && toRaw(incoming) !== toRaw(piniaStore.$state)) {
        piniaStore.$reset()
        piniaStore.$patch($state => Object.assign($state, incoming))
      }
    })
    // eslint-disable-next-line ts/no-unsafe-member-access
    const rootModules = store.state.x as Dictionary<unknown> | undefined
    if (rootModules) {
      ;(store as unknown as VuexStoreInternals)._withCommit(() => {
        piniaStores.forEach((piniaStore, name) => {
          rootModules[name] = piniaStore.$state
        })
      })
    }
  }

  store.replaceState = wrappedReplaceState

  return {
    piniaStores,
    restore: () => {
      // Do not remove the wrapper that a host could have added on top of ours.
      if (store.replaceState !== wrappedReplaceState) {
        return
      }
      if (hadOwnReplaceState) {
        store.replaceState = originalReplaceState
      } else {
        Reflect.deleteProperty(store, 'replaceState')
      }
    },
  }
}
