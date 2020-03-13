import { Subject } from 'rxjs/Subject';
import { Store } from 'vuex';
import { createWireFromFunction } from '../wires.factory';
import {
  debounce,
  filter,
  filterFalsyPayload,
  filterTruthyPayload,
  throttle
} from '../wires.operators';
import { WireParams } from '../wiring.types';

describe('testing wires operators', () => {
  const store: Store<any> = {
    dispatch: jest.fn(),
    commit: jest.fn()
  } as any;

  let subject: Subject<any>;

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
      const isEdible = ({ payload }: WireParams<any>): boolean => !nonEdibleFoods.includes(payload);
      const filteredWire = filter(wire, isEdible);

      filteredWire(subject, store);
      subject.next('broccoli');
      subject.next('artichoke');
      expect(executeFunction).not.toHaveBeenCalled();

      subject.next('pork belly');
      expect(executeFunction).toHaveBeenCalledTimes(1);
      expect(executeFunction).toHaveBeenCalledWith({
        store,
        payload: 'pork belly'
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

        falsyValues.forEach(value => subject.next(value));
        expect(executeFunction).not.toHaveBeenCalled();

        truthyValues.forEach(value => subject.next(value));
        expect(executeFunction).toHaveBeenCalledTimes(truthyValues.length);
      });

      test(`${filterTruthyPayload.name} avoids executing the wire when the payload is truthy`, () => {
        const filteredWire = filterTruthyPayload(wire);
        filteredWire(subject, store);

        truthyValues.forEach(value => subject.next(value));
        expect(executeFunction).not.toHaveBeenCalled();

        falsyValues.forEach(value => subject.next(value));
        expect(executeFunction).toHaveBeenCalledTimes(falsyValues.length);
      });
    });
  });

  describe('testing timing operators', () => {
    beforeAll(jest.useFakeTimers);
    afterAll(jest.useRealTimers);

    test(`${debounce.name} discards emitted values that take less than the specified time between output`, () => {
      const debouncedWire = debounce(wire, 500);
      debouncedWire(subject, store);

      subject.next(1);
      subject.next(2);
      subject.next(3);
      subject.next(4);
      subject.next(5);

      expect(executeFunction).not.toHaveBeenCalled();
      jest.runAllTimers();

      expect(executeFunction).toHaveBeenCalledTimes(1);
      expect(executeFunction).toHaveBeenCalledWith({ store, payload: 5 });
    });

    test(`${throttle.name} emits first value, and then ignores for the specified duration`, () => {
      const throttledWire = throttle(wire, 500);
      throttledWire(subject, store);

      subject.next(1);
      subject.next(2);
      subject.next(3);
      subject.next(4);
      subject.next(5);

      expect(executeFunction).toHaveBeenCalledTimes(1);
      expect(executeFunction).toHaveBeenCalledWith({ store, payload: 1 });
      jest.runAllTimers();

      expect(executeFunction).toHaveBeenCalledTimes(2);
      expect(executeFunction).toHaveBeenCalledWith({ store, payload: 5 });
    });
  });
});
