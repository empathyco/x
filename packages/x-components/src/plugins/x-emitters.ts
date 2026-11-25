import type { Dictionary } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { AnySimpleStateSelector, AnyStateSelector } from '../store/utils/store-emitters.utils'
import type { XEventPayload, XEventsTypes } from '../wiring/events.types'
import type { WireMetadata } from '../wiring/wiring.types'
import type { XBus } from '../x-bus'
import type { AnyXModule } from '../x-modules/x-modules.types'
import { deepEqual, forEach } from '@empathyco/x-utils'
import { watch } from 'vue'
import { getGettersProxyFromModule } from '../store/utils/getters-proxy.utils'
import {
  getXModuleDisplaysCount,
  hasXModuleConsumer,
  runInXModulesVisibilityScope,
  setXModulePendingEvent,
} from './x-modules-visibility'

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
    const { selector, immediate, filter, metadata, emitWhenVisible, ...options } =
      normalizeStateSelector(stateSelector)

    const watcherSelector = (): XEventPayload<typeof event> =>
      // eslint-disable-next-line ts/no-unsafe-return,ts/no-unsafe-member-access
      selector(store.state.x[name], safeGettersProxy)
    const emitEvent = (
      newValue: XEventPayload<typeof event>,
      oldValue?: XEventPayload<typeof event>,
    ): void => {
      void bus.emit(event, newValue, { ...metadata, moduleName: name, oldValue })
    }
    const gatedEmit = emitWhenVisible
      ? createVisibilityGatedEmit(name, event, emitEvent, watcherSelector)
      : emitEvent
    const emit: (
      newValue: XEventPayload<typeof event>,
      oldValue?: XEventPayload<typeof event>,
    ) => void = (newValue, oldValue) => {
      // eslint-disable-next-line ts/no-unsafe-member-access
      if (filter(newValue, oldValue, store.state.x[name])) {
        gatedEmit(newValue, oldValue)
      }
    }

    store.watch(watcherSelector, emit, options)

    if (immediate) {
      emit(watcherSelector())
    }
  })
}

/**
 * Wraps an emit function so the event is only emitted when the module data is needed:
 * - Every time one of its components becomes visible (goes from hidden to visible, see
 * `useXModuleVisibility`), even if another one was already visible, the latest value is emitted if it is not empty and it is different
 * from the last emitted one. Value changes while visible do not emit by themselves.
 * - While any component that always needs the data is mounted (see `useXModuleDataConsumer`),
 * every value change is emitted, as a regular emitter does.
 *
 * In both cases a value equal to the last emitted one is never emitted again.
 *
 * While the latest value is not empty and has not been emitted yet, the event is marked as pending
 * for the module (see `hasXModulePendingEvents`), so consumers know the module data is outdated.
 *
 * @param moduleName - The module whose consumers gate the emission.
 * @param event - The event name.
 * @param emit - The function that actually emits the event.
 * @param getValue - Returns the current value selected by the emitter.
 * @returns The gated emit function.
 * @internal
 */
function createVisibilityGatedEmit<Payload>(
  moduleName: AnyXModule['name'],
  event: string,
  emit: (newValue: Payload, oldValue?: Payload) => void,
  getValue: () => Payload,
): (newValue: Payload, oldValue?: Payload) => void {
  const { displaysCount, isAlwaysNeeded } = runInXModulesVisibilityScope(() => ({
    displaysCount: getXModuleDisplaysCount(moduleName),
    isAlwaysNeeded: hasXModuleConsumer('always', moduleName),
  }))
  let latest: Payload = getValue()
  let hasEmitted = false
  let lastEmitted: Payload | undefined

  const updatePending = (): void => {
    setXModulePendingEvent(
      moduleName,
      event,
      !!latest && !(hasEmitted && deepEqual(latest, lastEmitted ?? undefined)),
    )
  }

  const emitLatest = ({ allowEmpty }: { allowEmpty: boolean }): void => {
    if (!allowEmpty && !latest) {
      return
    }
    if (hasEmitted && deepEqual(latest ?? undefined, lastEmitted ?? undefined)) {
      return
    }
    const oldValue = lastEmitted
    hasEmitted = true
    lastEmitted = latest
    updatePending()
    emit(latest, oldValue)
  }

  runInXModulesVisibilityScope(() => {
    watch(displaysCount, (count, previousCount) => {
      if (count > previousCount) {
        emitLatest({ allowEmpty: false })
      }
    })

    watch(isAlwaysNeeded, alwaysNeeded => {
      if (alwaysNeeded) {
        emitLatest({ allowEmpty: false })
      }
    })
  })

  updatePending()

  return newValue => {
    latest = newValue
    if (isAlwaysNeeded.value) {
      emitLatest({ allowEmpty: true })
    }
    updatePending()
  }
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
