import { Store } from 'vuex';
import { getGettersProxyFromModule } from '../store/utils/getters-proxy.utils';
import { AnySimpleStateSelector, AnyStateSelector } from '../store/utils/store-emitters.utils';
import { debounce } from '../utils/debounce';
import { forEach } from '../utils/object';
import { AnyXModule } from '../x-modules/x-modules.types';
import { XBus } from './x-bus.types';

/**
 * Registers the store emitters, making them emit the event when the part of the state selected
 * changes.
 *
 * @param xModule - The {@link XModule} to register its Store Emitters.
 * @param bus - The {@Link XBus} to emit the events by the Emitters.
 * @param store - The Vuex store to access to state and getters to watch them.
 *
 * @internal
 */
export function registerStoreEmitters(
  { name, storeEmitters, storeModule }: AnyXModule,
  bus: XBus,
  store: Store<any>
): void {
  const safeGettersProxy = getGettersProxyFromModule(store.getters, name, storeModule);
  forEach(storeEmitters, (event, stateSelector: AnySimpleStateSelector | AnyStateSelector) => {
    const { selector, immediate, filter, ...options } = normalizeStateSelector(stateSelector);

    store.watch(
      state => selector(state.x[name], safeGettersProxy),
      debounce((newValue, oldValue) => {
        if (filter(newValue, oldValue)) {
          bus.emit(event, newValue, { moduleName: name });
        }
      }, 0),
      options
    );

    if (immediate) {
      Promise.resolve().then(() => {
        bus.emit(event, selector(store.state.x[name], safeGettersProxy));
      });
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
  const normalizedSelector = isSimpleSelector(stateSelector)
    ? { selector: stateSelector }
    : stateSelector;
  return {
    deep: false,
    immediate: false,
    filter: () => true,
    ...normalizedSelector
  };
}

/**
 * Checks if a the type of the store emitter selector is simple or complex. This selector can be
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
