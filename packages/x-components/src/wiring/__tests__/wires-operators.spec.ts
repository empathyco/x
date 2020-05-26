import { createLocalVue } from '@vue/test-utils';
import { Subject } from 'rxjs/Subject';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../store/store.types';
import { XModuleName } from '../../x-modules/x-modules.types';
import { createWireFromFunction } from '../wires.factory';
import {
  debounce,
  filter,
  filterBlacklistedModules,
  filterFalsyPayload,
  filterTruthyPayload,
  filterWhitelistedModules,
  throttle
} from '../wires.operators';
import { WireParams, WirePayload } from '../wiring.types';

describe('testing wires operators', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<any>({
    state: () => ({
      x: {
        querySuggestions: {
          config: { debounceInMs: 200 }
        }
      }
    }),
    getters: {
      'x/querySuggestions/parsedThrottleInMS': (state: RootXStoreState) =>
        state.x.querySuggestions.config.debounceInMs + 300
    }
  });

  let subject: Subject<WirePayload<any>>;

  function next(value: any, moduleName: XModuleName | null = null): void {
    subject.next({ eventPayload: value, metadata: { moduleName } });
  }

  beforeEach(() => {
    subject?.complete();
    subject = new Subject();
    jest.clearAllMocks();
  });

  const executeFunction = jest.fn();
  const wire = createWireFromFunction<any>(executeFunction);

  describe('testing filtering operators', () => {
    test(`${filter.name} only executes a wire when the condition is true`, () => {
      const nonEdibleFoods = ['lettuce', 'broccoli', 'artichoke'];
      const isEdible = ({ eventPayload }: WireParams<any>): boolean =>
        !nonEdibleFoods.includes(eventPayload);
      const filteredWire = filter(wire, isEdible);

      filteredWire(subject, store);
      next('broccoli');
      next('artichoke');
      expect(executeFunction).not.toHaveBeenCalled();

      next('pork belly');
      expect(executeFunction).toHaveBeenCalledTimes(1);
      expect(executeFunction).toHaveBeenCalledWith({
        eventPayload: 'pork belly',
        metadata: expect.any(Object),
        store
      });
    });

    describe('truthy and falsy filter operators', () => {
      const falsyValues = [false, '', 0, undefined, null, NaN];
      const truthyValues = [
        true,
        'a5 kobe',
        -1,
        {},
        [],
        () => {
          return;
        }
      ];
      test(`${filterFalsyPayload.name} avoids executing the wire when the payload is falsy`, () => {
        const filteredWire = filterFalsyPayload(wire);
        filteredWire(subject, store);

        falsyValues.forEach(value => next(value));
        expect(executeFunction).not.toHaveBeenCalled();

        truthyValues.forEach(value => next(value));
        expect(executeFunction).toHaveBeenCalledTimes(truthyValues.length);
      });

      test(
        filterTruthyPayload.name + ' avoids executing the wire when the payload is truthy',
        () => {
          const filteredWire = filterTruthyPayload(wire);
          filteredWire(subject, store);

          truthyValues.forEach(value => next(value));
          expect(executeFunction).not.toHaveBeenCalled();

          falsyValues.forEach(value => next(value));
          expect(executeFunction).toHaveBeenCalledTimes(falsyValues.length);
        }
      );
    });

    describe('events origin filter operators', () => {
      function getExpectedCallParameters(
        eventPayload: string,
        moduleName: XModuleName | null
      ): WireParams<string> {
        return {
          eventPayload,
          metadata: { moduleName },
          store
        };
      }

      test(
        filterWhitelistedModules.name +
          ' discards emitted values if their metadata moduleName is not in the whitelist',
        () => {
          const filteredWire = filterWhitelistedModules(wire, ['nextQueries', null]);
          filteredWire(subject, store);

          next('not-emitted', 'popularSearches');
          expect(executeFunction).not.toHaveBeenCalled();

          next('emitted-1');
          next('emitted-2', 'nextQueries');
          expect(executeFunction).toHaveBeenCalledTimes(2);
          expect(executeFunction).toHaveBeenNthCalledWith(
            1,
            getExpectedCallParameters('emitted-1', null)
          );
          expect(executeFunction).toHaveBeenNthCalledWith(
            2,
            getExpectedCallParameters('emitted-2', 'nextQueries')
          );
        }
      );

      test(
        filterBlacklistedModules.name +
          ' discards emitted values if their metadata moduleName is in the blacklist',
        () => {
          const filteredWire = filterBlacklistedModules(wire, ['searchBox']);
          filteredWire(subject, store);

          next('not-emitted', 'searchBox');
          expect(executeFunction).not.toHaveBeenCalled();

          next('emitted-1');
          next('emitted-2', 'nextQueries');
          expect(executeFunction).toHaveBeenCalledTimes(2);
          expect(executeFunction).toHaveBeenNthCalledWith(
            1,
            getExpectedCallParameters('emitted-1', null)
          );
          expect(executeFunction).toHaveBeenNthCalledWith(
            2,
            getExpectedCallParameters('emitted-2', 'nextQueries')
          );
        }
      );
    });
  });

  describe('testing timing operators', () => {
    beforeAll(jest.useFakeTimers);
    afterAll(jest.useRealTimers);

    test(
      debounce.name +
        ' discards emitted values that take less than the specified time between output',
      () => {
        const debouncedWire = debounce(wire, 500);
        debouncedWire(subject, store);

        next(1);
        next(2);
        next(3);
        next(4);
        next(5);

        expect(executeFunction).not.toHaveBeenCalled();
        jest.runAllTimers();

        expect(executeFunction).toHaveBeenCalledTimes(1);
        expect(executeFunction).toHaveBeenCalledWith({
          store,
          eventPayload: 5,
          metadata: expect.any(Object)
        });
      }
    );

    test(debounce.name + ' allows to access to the store to retrieve debounced time', () => {
      const debouncedTime = store.state.x.querySuggestions.config.debounceInMs;
      const debouncedWire = debounce(
        wire,
        storeModule => storeModule.state.x.querySuggestions.config.debounceInMs
      );
      debouncedWire(subject, store);

      next(1);
      next(2);
      next(3);

      jest.advanceTimersByTime(debouncedTime - 1);
      expect(executeFunction).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(executeFunction).toHaveBeenCalledTimes(1);
    });

    test(debounce.name + ' allows to change the debounced time dynamically', () => {
      const debouncedTime = 1000;
      const debouncedWire = debounce(
        wire,
        storeModule => storeModule.state.x.querySuggestions.config.debounceInMs
      );
      debouncedWire(subject, store);
      replaceDebouncedTimeInStore(debouncedTime);

      next(1);
      next(2);
      next(3);

      jest.advanceTimersByTime(debouncedTime - 1);
      expect(executeFunction).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(executeFunction).toHaveBeenCalledTimes(1);
    });

    test(throttle.name + 'emits first value, and then ignores for the specified duration', () => {
      const throttledWire = throttle(wire, 500);
      throttledWire(subject, store);

      next(1);
      next(2);
      next(3);
      next(4);
      next(5);

      expect(executeFunction).toHaveBeenCalledTimes(1);
      expect(executeFunction).toHaveBeenCalledWith({
        store,
        eventPayload: 1,
        metadata: expect.any(Object)
      });
      jest.runAllTimers();

      expect(executeFunction).toHaveBeenCalledTimes(2);
      expect(executeFunction).toHaveBeenCalledWith({
        store,
        eventPayload: 5,
        metadata: expect.any(Object)
      });
    });

    test(throttle.name + ' allows access to the store to retrieve throttled time', () => {
      const getterName = 'x/querySuggestions/parsedThrottleInMS';
      const throttledTime = store.getters[getterName];
      const throttledWire = throttle(wire, storeModule => storeModule.getters[getterName]);
      throttledWire(subject, store);

      next(1);
      next(2);
      next(3);

      expect(executeFunction).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(throttledTime - 1);
      expect(executeFunction).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(1);
      expect(executeFunction).toHaveBeenCalledTimes(2);
    });

    test(throttle.name + ' allows to change the throttled time dynamically', () => {
      const getterName = 'x/querySuggestions/parsedThrottleInMS';
      const throttledWire = throttle(wire, storeModule => storeModule.getters[getterName]);
      throttledWire(subject, store);
      replaceDebouncedTimeInStore(1000);
      const throttledTime = store.getters[getterName];

      next(1);
      next(2);
      next(3);

      expect(executeFunction).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(throttledTime - 1);
      expect(executeFunction).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(1);
      expect(executeFunction).toHaveBeenCalledTimes(2);
    });

    function replaceDebouncedTimeInStore(debounceInMs: number): void {
      store.replaceState({
        x: {
          querySuggestions: {
            config: { debounceInMs }
          }
        }
      });
    }
  });
});
