import { Observable } from 'rxjs';
import { BaseXBus } from '../../plugins/x-bus';
import { createWireFromFunction } from '../wires.factory';
import {
  debounce,
  filter,
  filterBlacklistedModules,
  filterFalsyPayload,
  filterTruthyPayload,
  filterWhitelistedModules,
  mapWire,
  throttle
} from '../wires.operators';
import { WireParams, WirePayload } from '../wiring.types';
import { createQuerySuggestionsStoreMock, getExpectedWirePayload, SubjectHandler } from './utils';

describe('testing wires operators', () => {
  const storeMock = createQuerySuggestionsStoreMock();
  const subjectHandler = new SubjectHandler();
  const executeFunction = jest.fn();
  const wire = createWireFromFunction<any>(executeFunction);
  let busMock = new BaseXBus();
  let busOnMock = busMock.on.bind(busMock);

  beforeEach(() => {
    subjectHandler.reset();
    jest.clearAllMocks();
  });

  describe('testing filtering operators', () => {
    test(`${filter.name} only executes a wire when the condition is true`, () => {
      const nonEdibleFoods = ['lettuce', 'broccoli', 'artichoke'];
      const isEdible = ({ eventPayload }: WireParams<any>): boolean =>
        !nonEdibleFoods.includes(eventPayload);
      const filteredWire = filter(wire, isEdible);

      filteredWire(subjectHandler.subject, storeMock, busOnMock);
      subjectHandler.emit(['broccoli', 'artichoke']);
      expect(executeFunction).not.toHaveBeenCalled();

      subjectHandler.emit('pork belly');
      expect(executeFunction).toHaveBeenCalledWith(getExpectedWirePayload('pork belly', storeMock));
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
        filteredWire(subjectHandler.subject, storeMock, busOnMock);

        subjectHandler.emit(falsyValues);
        expect(executeFunction).not.toHaveBeenCalled();

        subjectHandler.emit(truthyValues);
        expect(executeFunction).toHaveBeenCalledTimes(truthyValues.length);
      });

      test(
        filterTruthyPayload.name + ' avoids executing the wire when the payload is truthy',
        () => {
          const filteredWire = filterTruthyPayload(wire);
          filteredWire(subjectHandler.subject, storeMock, busOnMock);

          subjectHandler.emit(truthyValues);
          expect(executeFunction).not.toHaveBeenCalled();

          subjectHandler.emit(falsyValues);
          expect(executeFunction).toHaveBeenCalledTimes(falsyValues.length);
        }
      );
    });

    describe('events origin filter operators', () => {
      test(
        filterWhitelistedModules.name +
          ' discards emitted values if their metadata moduleName is not in the whitelist',
        () => {
          const filteredWire = filterWhitelistedModules(wire, ['nextQueries', null]);
          filteredWire(subjectHandler.subject, storeMock, busOnMock);

          subjectHandler.emit('not-emitted', 'popularSearches');
          expect(executeFunction).not.toHaveBeenCalled();

          subjectHandler.emit('emitted-1');
          subjectHandler.emit('emitted-2', 'nextQueries');
          expect(executeFunction).toHaveBeenNthCalledWith(
            1,
            getExpectedWirePayload('emitted-1', storeMock, null)
          );
          expect(executeFunction).toHaveBeenNthCalledWith(
            2,
            getExpectedWirePayload('emitted-2', storeMock, 'nextQueries')
          );
        }
      );

      test(
        filterBlacklistedModules.name +
          ' discards emitted values if their metadata moduleName is in the blacklist',
        () => {
          const filteredWire = filterBlacklistedModules(wire, ['searchBox']);
          filteredWire(subjectHandler.subject, storeMock, busOnMock);

          subjectHandler.emit('not-emitted', 'searchBox');
          expect(executeFunction).not.toHaveBeenCalled();

          subjectHandler.emit('emitted-1');
          subjectHandler.emit('emitted-2', 'nextQueries');
          expect(executeFunction).toHaveBeenNthCalledWith(
            1,
            getExpectedWirePayload('emitted-1', storeMock, null)
          );
          expect(executeFunction).toHaveBeenNthCalledWith(
            2,
            getExpectedWirePayload('emitted-2', storeMock, 'nextQueries')
          );
        }
      );
    });
  });

  describe('testing timing operators', () => {
    beforeAll(jest.useFakeTimers);
    afterAll(jest.useRealTimers);

    describe('testing operator ' + debounce.name, () => {
      test(
        debounce.name +
          ' discards emitted values that take less than the specified time between output',
        () => {
          const debouncedWire = debounce(wire, 500);
          debouncedWire(subjectHandler.subject, storeMock, busOnMock);
          subjectHandler.emit([1, 2, 3, 4, 5]);

          expect(executeFunction).not.toHaveBeenCalled();
          jest.runAllTimers();
          expect(executeFunction).toHaveBeenCalledTimes(1);
          expect(executeFunction).toHaveBeenCalledWith(getExpectedWirePayload(5, storeMock));
        }
      );

      test(debounce.name + ' allows to access to the store to retrieve debounced time', () => {
        const debouncedTime = storeMock.state.x.querySuggestions.config.debounceInMs;
        const debouncedWire = debounce(
          wire,
          storeModule => storeModule.state.x.querySuggestions.config.debounceInMs
        );
        debouncedWire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit([1, 2, 3]);

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
        debouncedWire(subjectHandler.subject, storeMock, busOnMock);
        replaceDebouncedTimeInStore(debouncedTime);
        subjectHandler.emit([1, 2, 3]);

        jest.advanceTimersByTime(debouncedTime - 1);
        expect(executeFunction).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1);
        expect(executeFunction).toHaveBeenCalledTimes(1);
      });

      describe('testing racing events functionality in ' + debounce.name, () => {
        beforeEach(() => {
          busMock = new BaseXBus();
          busOnMock = busMock.on.bind(busMock);
        });
        test(
          debounce.name +
            ' prevents execution of the debounce when the racing event wire is executed while the' +
            ' debounced wire is still waiting',
          () => {
            const userIsTypingAQueryObservable = busMock.on(
              'UserIsTypingAQuery',
              true
            ) as Observable<WirePayload<any>>;

            const debouncedWire = debounce(wire, 1000, 'UserAcceptedAQuery');
            debouncedWire(userIsTypingAQueryObservable, storeMock, busOnMock);

            busMock.emit('UserIsTypingAQuery');
            expect(executeFunction).not.toHaveBeenCalled();
            jest.runAllTimers();
            expect(executeFunction).toHaveBeenCalled();

            jest.useFakeTimers();
            executeFunction.mockClear();

            busMock.emit('UserIsTypingAQuery');
            expect(executeFunction).not.toHaveBeenCalled();
            busMock.emit('UserAcceptedAQuery');
            jest.runAllTimers();
            expect(executeFunction).not.toHaveBeenCalled();
          }
        );

        test(
          debounce.name +
            ' prevents execution of the debounce when any of the racing event wires are executed' +
            ' while the debounced wire is still waiting',
          () => {
            const userIsTypingAQueryObservable = busMock.on(
              'UserIsTypingAQuery',
              true
            ) as Observable<WirePayload<any>>;

            const debouncedWire = debounce(wire, 1000, ['UserAcceptedAQuery', 'UserClearedQuery']);
            debouncedWire(userIsTypingAQueryObservable, storeMock, busOnMock);

            busMock.emit('UserIsTypingAQuery');
            expect(executeFunction).not.toHaveBeenCalled();
            busMock.emit('UserClearedQuery');
            jest.runAllTimers();
            expect(executeFunction).not.toHaveBeenCalled();
          }
        );
      });
    });

    describe('testing operator ' + throttle.name, () => {
      test(
        throttle.name + ' emits first value, and then ignores for the specified duration',
        () => {
          const throttledWire = throttle(wire, 500);

          throttledWire(subjectHandler.subject, storeMock, busOnMock);
          subjectHandler.emit([1, 2, 3, 4, 5]);

          expect(executeFunction).toHaveBeenCalledWith(getExpectedWirePayload(1, storeMock));
          jest.runAllTimers();
          expect(executeFunction).toHaveBeenCalledTimes(2);
          expect(executeFunction).toHaveBeenCalledWith(getExpectedWirePayload(5, storeMock));
        }
      );

      test(throttle.name + ' allows access to the store to retrieve throttled time', () => {
        const getterName = 'x/querySuggestions/fakeThrottleInMS';
        const throttledTime = storeMock.getters[getterName];
        const throttledWire = throttle(wire, storeModule => storeModule.getters[getterName]);

        throttledWire(subjectHandler.subject, storeMock, busOnMock);
        subjectHandler.emit([1, 2, 3]);

        expect(executeFunction).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(throttledTime - 1);
        expect(executeFunction).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1);
        expect(executeFunction).toHaveBeenCalledTimes(2);
      });

      test(throttle.name + ' allows to change the throttled time dynamically', () => {
        const getterName = 'x/querySuggestions/fakeThrottleInMS';
        const throttledWire = throttle(wire, storeModule => storeModule.getters[getterName]);

        throttledWire(subjectHandler.subject, storeMock, busOnMock);
        replaceDebouncedTimeInStore(1000);
        const throttledTime = storeMock.getters[getterName];
        subjectHandler.emit([1, 2, 3]);

        expect(executeFunction).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(throttledTime - 1);
        expect(executeFunction).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1);
        expect(executeFunction).toHaveBeenCalledTimes(2);
      });
    });

    describe('testing operator ' + mapWire.name, () => {
      test(
        mapWire.name + ' emits the valued transformed by the function passed by parameter',
        () => {
          const mappedWire = mapWire(wire, (payload: number) => payload + 1);

          mappedWire(subjectHandler.subject, storeMock, busOnMock);
          const emittedValues = [1, 2, 3, 4, 5];
          subjectHandler.emit(emittedValues);

          expect(executeFunction).toHaveBeenCalledTimes(5);
          executeFunction.mock.calls.forEach(([payload], index) => {
            expect(payload).toEqual(getExpectedWirePayload(emittedValues[index] + 1, storeMock));
          });
        }
      );
    });

    function replaceDebouncedTimeInStore(debounceInMs: number): void {
      storeMock.replaceState({
        x: {
          querySuggestions: {
            config: { debounceInMs }
          }
        }
      });
    }
  });
});
