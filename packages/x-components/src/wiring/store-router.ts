import type { Dictionary } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { XModuleName } from '../x-modules/x-modules.types'

/**
 * Route that sends the namespaced commits and dispatches of a module to its Pinia store.
 *
 * @internal
 */
export interface PiniaRoute {
  /** The Pinia store. */
  store: Dictionary
  /** Vuex mutation names, mapped to the Pinia action to execute. */
  mutations: Dictionary<string>
  /** Vuex action names, mapped to the Pinia action to execute. */
  actions: Dictionary<string>
}

/**
 * Executes a Pinia action with a payload.
 *
 * @internal
 */
export type PiniaExecutor = (payload?: unknown) => unknown

/*
 * The routes are scoped by Vuex store, so a route registered by a plugin never affects any other
 * store. Wires that go through the router skip the Vuex `subscribe` and `subscribeAction`
 * subscribers: no module uses a Pinia store yet that could notify them. This must be reviewed before
 * a module has Pinia as its only store.
 *
 * It can only import types. Importing the plugin from here creates a circular dependency that
 * breaks the build.
 */
const routes = new WeakMap<Store<any>, Map<XModuleName, PiniaRoute>>()

/**
 * Registers the route of a module with a Pinia store.
 *
 * @param store - The Vuex store the route belongs to.
 * @param name - The name of the module.
 * @param route - The route to its Pinia store.
 * @internal
 */
export function setPiniaStoreRoute(store: Store<any>, name: XModuleName, route: PiniaRoute): void {
  const storeRoutes = routes.get(store) ?? new Map<XModuleName, PiniaRoute>()
  storeRoutes.set(name, route)
  routes.set(store, storeRoutes)
}

/**
 * Removes all the routes of a store.
 *
 * @param store - The Vuex store.
 * @internal
 */
export function clearStoreRoutes(store: Store<any>): void {
  routes.delete(store)
}

/**
 * Gets the backend of a module.
 *
 * @param store - The Vuex store.
 * @param name - The name of the module.
 * @returns `pinia` if the module has a registered route, `vuex` otherwise.
 * @internal
 */
export function getStoreBackend(store: Store<any>, name: XModuleName): 'vuex' | 'pinia' {
  return routes.get(store)?.has(name) ? 'pinia' : 'vuex'
}

/**
 * Gets the function that executes a namespaced Vuex path on the Pinia store of its module.
 *
 * @param store - The Vuex store.
 * @param type - Whether the path is a `commit` or a `dispatch`.
 * @param path - The full Vuex path. I.e. `x/searchBox/setQuery`.
 * @returns The executor, or `undefined` if the path must go through Vuex.
 * @internal
 */
export function getPiniaExecutor(
  store: Store<any>,
  type: 'commit' | 'dispatch',
  path: string,
): ((payload?: unknown) => unknown) | undefined {
  const storeRoutes = routes.get(store)
  if (!storeRoutes) {
    return undefined
  }
  const [root, name, ...rest] = path.split('/')
  const route = root === 'x' ? storeRoutes.get(name as XModuleName) : undefined
  const actionName = route?.[type === 'commit' ? 'mutations' : 'actions'][rest.join('/')]
  if (!route || !actionName) {
    return undefined
  }
  const execute = (payload?: unknown) => (route.store[actionName] as PiniaExecutor)(payload)
  return type === 'commit'
    ? payload => {
        execute(payload)
      }
    : // Not `async` on purpose: like Vuex, the errors thrown by the action are propagated synchronously.
      // eslint-disable-next-line ts/promise-function-async
      payload => Promise.resolve(execute(payload))
}
