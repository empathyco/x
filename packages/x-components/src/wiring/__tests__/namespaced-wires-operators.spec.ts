import { BaseXBus } from '../../plugins/x-bus';
import { namespacedDebounce, namespacedThrottle } from '../namespaced-wires.operators';
import { createWireFromFunction } from '../wires.factory';
import * as operators from '../wires.operators';
import { createQuerySuggestionsStoreMock, getExpectedWirePayload, SubjectHandler } from './utils';

describe('testing namespaced wires operators', () => {
  const moduleName = 'querySuggestions';
  const storeMock = createQuerySuggestionsStoreMock();
  const timeInMs = storeMock.state.x.querySuggestions.config.debounceInMs;
  const busMock = new BaseXBus();
  const busOnMock = busMock.on.bind(busMock);

  const executeFunction = jest.fn();
  const wire = createWireFromFunction<any>(executeFunction);
  const subjectHandler = new SubjectHandler();

  beforeEach(() => {
    subjectHandler.reset();
    executeFunction.mockClear();
  });
  beforeAll(jest.useFakeTimers);
  afterAll(jest.useRealTimers);

  test(
    namespacedDebounce.name + ' allows creating wires with debounced time retrieved from the store',
    () => {
      createAndEmitTimeWireOperator(namespacedDebounce);

      jest.advanceTimersByTime(timeInMs - 1);
      expect(executeFunction).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(executeFunction).toHaveBeenCalledTimes(1);
      expect(executeFunction).toHaveBeenCalledWith(getExpectedWirePayload(5, storeMock));
    }
  );

  test(
    namespacedDebounce.name + ' allows creating wires with debounced time that race events',
    () => {
      const debounceSpyOn = jest.spyOn(operators, 'debounce');
      namespacedDebounce(moduleName)(wire, jest.fn(), 'UserIsTypingAQuery');
      expect(debounceSpyOn).toHaveBeenCalledWith(wire, expect.any(Function), 'UserIsTypingAQuery');
    }
  );

  test(
    namespacedThrottle.name + ' allows creating wires with throttled time retrieved from the store',
    () => {
      createAndEmitTimeWireOperator(namespacedThrottle);

      expect(executeFunction).toHaveBeenCalledWith(getExpectedWirePayload(1, storeMock));
      jest.advanceTimersByTime(timeInMs - 1);
      expect(executeFunction).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(1);
      expect(executeFunction).toHaveBeenCalledTimes(2);
      expect(executeFunction).toHaveBeenCalledWith(getExpectedWirePayload(5, storeMock));
    }
  );

  function createAndEmitTimeWireOperator(
    namespacedTimeOperator: typeof namespacedThrottle | typeof namespacedDebounce
  ): void {
    const namespacedTimeWire = namespacedTimeOperator(moduleName)(
      wire,
      ({ state }) => state.config.debounceInMs
    );
    namespacedTimeWire(subjectHandler.subject, storeMock, busOnMock);
    subjectHandler.emit([1, 2, 3, 4, 5]);
  }
});
