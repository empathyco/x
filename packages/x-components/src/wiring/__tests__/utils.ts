import { createLocalVue } from '@vue/test-utils';
import { Subject } from 'rxjs/Subject';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../store/store.types';
import { XModuleName } from '../../x-modules/x-modules.types';
import { WireParams, WirePayload } from '../wiring.types';

/**
 * Create a mocked Vue store for testing purpose with only querySuggestions state and getters.
 *
 * @returns A mocked Vue store.
 *
 * @internal
 */
export function createQuerySuggestionsStoreMock(): Store<any> {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<any>({
    state: () => ({
      x: {
        querySuggestions: {
          query: '',
          config: { debounceInMs: 200 }
        }
      }
    }),
    getters: {
      'x/querySuggestions/fakeThrottleInMS': (state: RootXStoreState) =>
        state.x.querySuggestions.config.debounceInMs + 300,
      'x/querySuggestions/fakeTrimmedQuery': (state: RootXStoreState) =>
        state.x.querySuggestions.query.trim()
    }
  });
  store.commit = jest.fn();
  store.dispatch = jest.fn();
  return store;
}

/**
 * Utility class to handle the subject for testing wiring.
 */
export class SubjectHandler {
  public subject: Subject<WirePayload<any>>;

  /**
   * Creates a new Subject.
   */
  public constructor() {
    this.subject = new Subject();
  }

  /**
   * Emits as many values to the Observable created in the constructor as items contains the
   * `values` parameter. Each value will be emitter with the `moduleName` passed as parameter
   * following the expected {@link WirePayload} type.
   *
   * @param values - Values to be emitted to the observable as `eventPayload`. It can be an array of
   * values or a simple value.
   * @param moduleName - The moduleName which will be emitted to the observable as `metadata` value.
   */
  emit(values: unknown[] | unknown, moduleName: XModuleName | null = null): void {
    const processedValues = Array.isArray(values) ? values : [values];
    processedValues.forEach(value => {
      this.subject.next({ eventPayload: value, metadata: { moduleName } });
    });
  }

  /**
   * Completes the current Subject and creates a new one.
   */
  reset(): void {
    this.subject.complete();
    this.subject = new Subject();
  }
}

/**
 * Utility function which creates an object with the expected {@link WireParams}.
 *
 * @param eventPayload - Payload of the event.
 * @param store - Mocked Vuex store.
 * @param moduleName - Module name for metadata parameter.
 * @returns An object with the {@link WireParams}.
 *
 * @internal
 */
export function getExpectedWirePayload<T>(
  eventPayload: T,
  store: Store<any>,
  moduleName?: XModuleName | null
): WireParams<T> {
  return {
    eventPayload,
    metadata: moduleName ? { moduleName } : expect.any(Object),
    store
  };
}
