import { XBus } from '@empathyco/x-bus';
import { forEach } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { getGettersProxyFromModule } from '../store/utils/getters-proxy.utils';
import { AnySimpleStateSelector, AnyStateSelector } from '../store/utils/store-emitters.utils';
import { XEventPayload, XEventsTypes } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { AnyXModule } from '../x-modules/x-modules.types';

/**
 * Registers the store emitters, making them emit the event when the part of the state selected
 * changes.
 *
 * @param xModule - The {@link XModule} to register its Store Emitters.
 * @param bus - The {@link @empathyco/x-bus#XBus} to emit the events by the Emitters.
 * @param store - The Vuex store to access to state and getters to watch them.
 *
 * @internal
 */
export function registerStoreEmitters(
  { name, storeEmitters, storeModule }: AnyXModule,
  bus: XBus<XEventsTypes, WireMetadata>,
  store: Store<any>
): void {
  const safeGettersProxy = getGettersProxyFromModule(store.getters, name, storeModule);
  forEach(storeEmitters, (event, stateSelector: AnySimpleStateSelector | AnyStateSelector) => {
    const { selector, immediate, filter, metadata, ...options } =
      normalizeStateSelector(stateSelector);

    const watcherSelector = (): XEventPayload<typeof event> =>
      selector(store.state.x[name], safeGettersProxy);
    const emit: (
      newValue: XEventPayload<typeof event>,
      oldValue?: XEventPayload<typeof event>
    ) => void = (newValue, oldValue) => {
      if (filter(newValue, oldValue, store.state.x[name])) {
        bus.emit(event, newValue, { ...metadata, moduleName: name, oldValue });
      }
    };

    store.watch(watcherSelector, emit, options);

    if (immediate) {
      emit(watcherSelector());
    }
  });
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
function normalizeStateSelector(
  stateSelector: AnySimpleStateSelector | AnyStateSelector
): Required<AnyStateSelector> {
  const selectorOptions = isSimpleSelector(stateSelector)
    ? { selector: stateSelector }
    : stateSelector;

  return {
    deep: false,
    immediate: false,
    filter: () => true,
    metadata: {
      replaceable: true
    },
    ...selectorOptions
  };
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
  stateSelector: AnySimpleStateSelector | AnyStateSelector
): stateSelector is AnySimpleStateSelector {
  return typeof stateSelector === 'function';
}
