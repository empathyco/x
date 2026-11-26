import type { Dictionary } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { AnySimpleStateSelector, AnyStateSelector } from '../store/utils/store-emitters.utils'
import type { XEventPayload, XEventsTypes } from '../wiring/events.types'
import type { WireMetadata } from '../wiring/wiring.types'
import type { XBus } from '../x-bus'
import type { AnyXModule } from '../x-modules/x-modules.types'
import { forEach } from '@empathyco/x-utils'
import { watch } from 'vue'
import { getGettersProxyFromModule } from '../store/utils/getters-proxy.utils'
import { isXModuleDisplayed } from './x-module-visibility'

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
  { name, storeEmitters, storeModule }: AnyXModule,
  bus: XBus<XEventsTypes, WireMetadata>,
  store: Store<any>,
): void {
  const safeGettersProxy = getGettersProxyFromModule(store.getters as Dictionary, name, storeModule)
  forEach(storeEmitters, (event, stateSelector: AnySimpleStateSelector | AnyStateSelector) => {
    const { selector, immediate, filter, metadata, waitForDisplay, ...options } =
      normalizeStateSelector(stateSelector)

    const watcherSelector = (): XEventPayload<typeof event> =>
      // eslint-disable-next-line ts/no-unsafe-return,ts/no-unsafe-member-access
      selector(store.state.x[name], safeGettersProxy)

    /**
     * True when the emitter has to wait for a component of the module to be displayed.
     * It is evaluated on every change, so the `loadWhenVisible` config can be toggled at runtime.
     */
    const isWaitingForDisplay = () =>
      !!waitForDisplay &&
      // eslint-disable-next-line ts/no-unsafe-member-access
      !!store.state.x[name]?.config?.loadWhenVisible &&
      !isXModuleDisplayed(name)

    let hasEmitted = false
    let lastEmittedValue: XEventPayload<typeof event> | undefined
    let hasPendingValue = false
    let pendingOldValue: XEventPayload<typeof event> | undefined

    function emit(newValue: XEventPayload<typeof event>, oldValue?: XEventPayload<typeof event>) {
      if (isWaitingForDisplay()) {
        // Keep the value that was emitted before starting to wait, so the filter and the event
        // metadata compare against what the wires last received.
        if (!hasPendingValue) {
          hasPendingValue = true
          pendingOldValue = hasEmitted ? lastEmittedValue : oldValue
        }
        return
      }
      // eslint-disable-next-line ts/no-unsafe-member-access
      if (filter(newValue, oldValue, store.state.x[name])) {
        hasEmitted = true
        lastEmittedValue = newValue
        void bus.emit(event, newValue, { ...metadata, moduleName: name, oldValue })
      }
    }

    store.watch(watcherSelector, emit, options)

    if (waitForDisplay) {
      // When the module becomes displayed, emit the value that was held while waiting, unless it
      // is the same one that was already emitted.
      watch(
        () => isXModuleDisplayed(name),
        displayed => {
          if (!displayed || !hasPendingValue) {
            return
          }
          const value = watcherSelector()
          const oldValue = pendingOldValue
          hasPendingValue = false
          pendingOldValue = undefined
          if (!(hasEmitted && value === lastEmittedValue)) {
            emit(value, oldValue)
          }
        },
      )
    }

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
