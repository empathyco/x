import { forEach, Dictionary } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { getGettersProxyFromModule } from '../store/utils/getters-proxy.utils';
import { AnySimpleStateSelector, AnyStateSelector } from '../store/utils/store-emitters.utils';
import { debounce } from '../utils/debounce';
import { DebouncedFunction } from '../utils/types';
import { XEvent, XEventPayload } from '../wiring/events.types';
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
    const { selector, immediate, filter, ...options } = normalizeStateSelector(
      stateSelector,
      event
    );

    const watcherSelector = (): XEventPayload<typeof event> =>
      selector(store.state.x[name], safeGettersProxy);
    const emit = debounceWatcherEffect(event, (newValue, oldValue) => {
      if (filter(newValue, oldValue)) {
        bus.emit(event, newValue, { moduleName: name, oldValue });
      }
    });

    store.watch(watcherSelector, emit, options);

    if (immediate) {
      emit(watcherSelector());
    }
  });
}

/**
 * This function "wraps" the watcher effect (the callback of the watcher) with debounce to avoid
 * repeating events and request. Right now this function wraps every effect in a debounce and adds
 * an extra debounce to the "SecondLevelEvent" events, to try to delay this events after the state
 * change events.
 *
 * @param event - The {@link XEvent} to emit.
 * @param watcherEffect - The callback to execute.
 * @returns A new function with the `watcherEffect` callback wrapped in debounce.
 */
function debounceWatcherEffect<Event extends XEvent = XEvent>(
  event: Event,
  watcherEffect: (newValue: XEventPayload<Event>, oldValue: XEventPayload<Event>) => void
): (newValue: XEventPayload<Event>, oldValue: XEventPayload<Event>) => void {
  /*
   * Due the debounce added to the watch callback, the `oldValue` would be the one from the last
   * watcher execution instead of the last callback execution. This would cause problems receiving
   * unstable oldValues, used in the Emitter filter.
   * To solve this, we store the `oldValue` of the watcher in the `previousValue` variable, and we
   * keep there until the watcher callback is finally executed (after the debounce). Then this
   * `previousValue` is cleared to store the next `oldValue`.
   */
  let previousValue: XEventPayload<Event> | undefined = undefined;

  let watcherCallback = debounce(
    (newValue: XEventPayload<Event>, oldValue: XEventPayload<Event>): void => {
      watcherEffect(newValue, oldValue);
      previousValue = undefined;
    },
    0
  );
  /* Only applying the extra debounce to the "SecondLevelEvent" events to avoid repeating outer
   * effects (requests, URL changes). If we only apply the debounce to all the events we still have
   * the problem of outer effects. */
  if (isSecondLevelEventEmitter(event)) {
    const previousCallback = watcherCallback;
    const debouncedPreviousCallback = debounce(previousCallback, 0);
    watcherCallback = ((n, o) => {
      previousCallback.cancel();
      debouncedPreviousCallback(n, o);
    }) as DebouncedFunction<any>;
  }

  return (newValue, oldValue) => {
    previousValue = previousValue !== undefined ? previousValue : oldValue;
    watcherCallback(newValue, previousValue);
  };
}

/**
 * Transforms a {@link AnySimpleStateSelector} into a {@link AnyStateSelector}, and sets
 * default values for its properties.
 *
 * @param stateSelector - The state selector to normalize.
 * @param event - The event name of the emitter.
 * @returns A {@link AnyStateSelector} with all the properties set.
 *
 * @internal
 */
function normalizeStateSelector(
  stateSelector: AnySimpleStateSelector | AnyStateSelector,
  event: XEvent
): Required<AnyStateSelector> {
  const normalizedSelector = isSimpleSelector(stateSelector)
    ? { selector: stateSelector }
    : stateSelector;
  return {
    deep: false,
    immediate: false,
    filter: isSecondLevelEventEmitter(event)
      ? (newValue, oldValue) => !hasPayloadChanged(newValue, oldValue)
      : () => true,
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

// TODO: Generalize the Naming of the Events to take this into account
const secondLevelEvents: RegExp[] = [/RequestChanged$/, /UrlStateChanged$/];

/**
 * Function to detect if an {@link XEvent} is a "SecondLevelEvent", to treat it differently.
 *
 * @param event - The name of the {@link XEvent} to check.
 * @returns True if is an `SecondLevelEvent`, False otherwise.
 *
 * @internal
 */
function isSecondLevelEventEmitter(event: XEvent): boolean {
  return secondLevelEvents.some(regex => regex.test(event));
}
/**
 * Function to filter if a payload of an {@link XEvent} has really changed or not. It only
 * compares the first level of fields and not deeply, to avoid CPU consuming task here.
 *
 * @param request1 - First request to compare.
 * @param request2 - Second request to compare.
 * @returns True if the two objects are different, false otherwise.
 *
 * @internal
 */
function hasPayloadChanged<T extends Dictionary>(request1?: T, request2?: T): boolean {
  if (request1 === request2) {
    return true;
  }
  if (!request1 || !request2) {
    return false;
  }
  const keys1 = Object.keys(request1);
  const keys2 = Object.keys(request2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  return !keys1.some(key => request1[key] !== request2[key]);
}
