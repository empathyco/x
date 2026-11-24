import type { Dictionary } from '@empathyco/x-utils'
import type { EffectScope, WatchOptions } from 'vue'
import type { Store } from 'vuex'
import type { AnyPiniaStore } from '../store/pinia/define-x-store'
import type { AnySimpleStateSelector, AnyStateSelector } from '../store/utils/store-emitters.utils'
import type { XEventPayload, XEventsTypes } from '../wiring/events.types'
import type { WireMetadata } from '../wiring/wiring.types'
import type { XBus } from '../x-bus'
import type { AnyXModule } from '../x-modules/x-modules.types'
import { forEach } from '@empathyco/x-utils'
import { watch } from 'vue'
import { getGettersProxyFromModule } from '../store/utils/getters-proxy.utils'

/**
 * Registers the store emitters, making them emit the event when the part of the state selected
 * changes.
 *
 * @param xModule - The {@link XModule} to register its Store Emitters.
 * @param bus - The XBus to emit the events by the Emitters.
 * @param store - The Vuex store to access to state and getters to watch them.
 * @internal
 */
export function registerStoreEmitters(
  xModule: AnyXModule,
  bus: XBus<XEventsTypes, WireMetadata>,
  store: Store<any>,
): void {
  const { name, storeModule } = xModule
  const safeGettersProxy = getGettersProxyFromModule(store.getters as Dictionary, name, storeModule)
  createStoreEmittersWatchers(
    xModule,
    bus,
    // eslint-disable-next-line ts/no-unsafe-member-access
    () => store.state.x[name],
    safeGettersProxy,
    (selector, emit, options) => {
      store.watch(selector, emit, options)
    },
  )
}

/**
 * Registers the store emitters of a module that has its state in Pinia, making them emit the event
 * when the part of the state selected changes. The watchers are created inside the effect scope
 * passed, so they can be stopped with it.
 *
 * @param xModule - The {@link XModule} to register its Store Emitters.
 * @param bus - The XBus to emit the events by the Emitters.
 * @param piniaStore - The Pinia store of the module to access to state and getters to watch them.
 * @param getterNames - The names of the getters that the selectors can access.
 * @param scope - The effect scope where the watchers are created.
 * @internal
 */
export function registerPiniaStoreEmitters(
  xModule: AnyXModule,
  bus: XBus<XEventsTypes, WireMetadata>,
  piniaStore: AnyPiniaStore,
  getterNames: string[],
  scope: EffectScope,
): void {
  const gettersProxy = getterNames.reduce<Dictionary>(
    (proxy, getterName) =>
      Object.defineProperty(proxy, getterName, {
        enumerable: true,
        get: () => piniaStore[getterName],
      }),
    {},
  )
  createStoreEmittersWatchers(
    xModule,
    bus,
    () => piniaStore.$state,
    gettersProxy,
    (selector, emit, options) => {
      scope.run(() => watch(selector, emit, options))
    },
  )
}

/**
 * Creates the watchers of the store emitters of a module. It is independent of the store backend.
 *
 * @param xModule - The {@link XModule} to register its Store Emitters.
 * @param bus - The XBus to emit the events by the Emitters.
 * @param getState - Function that returns the state of the module.
 * @param gettersProxy - The getters that the selectors can access.
 * @param watchFn - Function that creates the watcher with the backend of the module.
 * @internal
 */
function createStoreEmittersWatchers(
  { name, storeEmitters }: AnyXModule,
  bus: XBus<XEventsTypes, WireMetadata>,
  getState: () => unknown,
  gettersProxy: unknown,
  watchFn: (
    selector: () => any,
    emit: (newValue: any, oldValue?: any) => void,
    options: WatchOptions,
  ) => void,
): void {
  forEach(storeEmitters, (event, stateSelector: AnySimpleStateSelector | AnyStateSelector) => {
    const { selector, immediate, filter, metadata, ...options } =
      normalizeStateSelector(stateSelector)

    const watcherSelector = (): XEventPayload<typeof event> =>
      // eslint-disable-next-line ts/no-unsafe-return
      selector(getState(), gettersProxy)
    const emit: (
      newValue: XEventPayload<typeof event>,
      oldValue?: XEventPayload<typeof event>,
    ) => void = (newValue, oldValue) => {
      if (filter(newValue, oldValue, getState())) {
        void bus.emit(event, newValue, { ...metadata, moduleName: name, oldValue })
      }
    }

    watchFn(watcherSelector, emit, options)

    if (immediate) {
      emit(watcherSelector())
    }
  })
}

/**
 * Transforms a {@link AnySimpleStateSelector} into a {@link AnyStateSelector}, and sets
 * default values for its properties.
 *
 * @param stateSelector - The state selector to normalize.
 * @returns A {@link AnyStateSelector} with all the properties set.
 *
 * @internal
 */
function normalizeStateSelector(stateSelector: AnySimpleStateSelector | AnyStateSelector) {
  const selectorOptions = isSimpleSelector(stateSelector)
    ? { selector: stateSelector }
    : stateSelector

  return {
    deep: false,
    immediate: false,
    filter: () => true,
    metadata: {
      replaceable: true,
    },
    ...selectorOptions,
  }
}

/**
 * Checks if the type of the store emitter selector is simple or complex. This selector can be
 * a function if it is simple or an object with the selector and other options if it is complex.
 *
 * @param stateSelector - The store emitter selector.
 * @returns A boolean which flags if the stateSelector is simple (function) or complex (object).
 *
 * @internal
 */
export function isSimpleSelector(
  stateSelector: AnySimpleStateSelector | AnyStateSelector,
): stateSelector is AnySimpleStateSelector {
  return typeof stateSelector === 'function'
}
