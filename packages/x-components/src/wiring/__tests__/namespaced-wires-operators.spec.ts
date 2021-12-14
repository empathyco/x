import { createResultStub } from '../../__stubs__/index';
import { namespacedDebounce, namespacedThrottle } from '../namespaced-wires.operators';
import { createWire } from './operators-testing-utils';

describe('testing namespaced wires operators', () => {
  beforeAll(jest.useFakeTimers);
  afterAll(jest.useRealTimers);

  describe(`testing ${namespacedDebounce.name}`, () => {
    it('creates wires with debounced time retrieved from the given store module', () => {
      const { wire, callback, registerWire, emitWireEvent } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 1000 } } }
      });

      registerWire(
        namespacedDebounce('querySuggestions')(wire, ({ state }) => state.config.debounceInMs)
      );

      emitWireEvent('1', '2', '3');
      jest.advanceTimersByTime(999);
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('3');
    });

    it('allows cancelling the debounce when an event is emitted', () => {
      const { wire, callback, registerWire, emitWireEvent, bus } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 1000 } } }
      });

      registerWire(
        namespacedDebounce('querySuggestions')(wire, ({ state }) => state.config.debounceInMs, {
          cancelOn: 'UserClearedQuery'
        })
      );

      emitWireEvent('1', '2', '3');
      jest.advanceTimersByTime(999);
      expect(callback).not.toHaveBeenCalled();

      bus.emit('UserClearedQuery', '');
      jest.advanceTimersByTime(1);
      expect(callback).not.toHaveBeenCalled();
    });

    it('allows forcing the debounce when an event is emitted', () => {
      const { wire, callback, registerWire, emitWireEvent, bus } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 1000 } } }
      });

      registerWire(
        namespacedDebounce('querySuggestions')(wire, ({ state }) => state.config.debounceInMs, {
          forceOn: 'UserClickedAResult'
        })
      );

      emitWireEvent('1', '2', '3');
      expect(callback).not.toHaveBeenCalled();

      bus.emit('UserClickedAResult', createResultStub('Random result'));
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('3');

      jest.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe(`testing ${namespacedThrottle.name}`, () => {
    it('creates wires with throttle time retrieved from the given store module', () => {
      const { wire, callback, registerWire, emitWireEvent } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 1000 } } }
      });

      registerWire(
        namespacedThrottle('querySuggestions')(wire, ({ state }) => state.config.debounceInMs)
      );

      emitWireEvent('1', '2', '3');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('1');

      jest.advanceTimersByTime(999);
      expect(callback).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('3');
    });

    it('allows cancelling the throttle when an event is emitted', () => {
      const { wire, callback, registerWire, emitWireEvent, bus } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 1000 } } }
      });

      registerWire(
        namespacedThrottle('querySuggestions')(wire, ({ state }) => state.config.debounceInMs, {
          cancelOn: 'UserClearedQuery'
        })
      );

      emitWireEvent('1', '2', '3');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('1');

      bus.emit('UserClearedQuery', '');
      jest.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('allows forcing the throttle when an event is emitted', () => {
      const { wire, callback, registerWire, emitWireEvent, bus } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 1000 } } }
      });

      registerWire(
        namespacedThrottle('querySuggestions')(wire, ({ state }) => state.config.debounceInMs, {
          forceOn: 'UserClickedAResult'
        })
      );

      emitWireEvent('1', '2', '3');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('1');

      bus.emit('UserClickedAResult', createResultStub('Random result'));
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('3');

      jest.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
