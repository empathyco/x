import { BaseXBus } from '../../plugins/x-bus';
import { createWireFromFunction } from '../wires.factory';
import {
  filter,
  filterBlacklistedModules,
  filterFalsyPayload,
  filterTruthyPayload,
  filterWhitelistedModules,
  mapWire
} from '../wires.operators';
import { WireParams } from '../wiring.types';
import { createQuerySuggestionsStoreMock, getExpectedWirePayload, SubjectHandler } from './utils';

describe('testing wires operators', () => {
  const storeMock = createQuerySuggestionsStoreMock();
  const subjectHandler = new SubjectHandler();
  const executeFunction = jest.fn();
  const wire = createWireFromFunction(executeFunction);
  const busMock = new BaseXBus();
  const busOnMock = busMock.on.bind(busMock);

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

  describe('testing operator ' + mapWire.name, () => {
    test(mapWire.name + ' emits the valued transformed by the function passed by parameter', () => {
      const mappedWire = mapWire(wire, (payload: number) => payload + 1);

      mappedWire(subjectHandler.subject, storeMock, busOnMock);
      const emittedValues = [1, 2, 3, 4, 5];
      subjectHandler.emit(emittedValues);

      expect(executeFunction).toHaveBeenCalledTimes(5);
      executeFunction.mock.calls.forEach(([payload], index) => {
        expect(payload).toEqual(getExpectedWirePayload(emittedValues[index] + 1, storeMock));
      });
    });
  });
});
