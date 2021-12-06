import { createResultStub } from '../../__stubs__/index';
import { debounce } from '../wires.operators';
import { createWire } from './operators-testing-utils';

describe(`testing ${debounce.name} operator`, () => {
  beforeAll(jest.useFakeTimers);
  afterAll(jest.useRealTimers);

  it('discards emitted values that take less than the specified time between output', () => {
    const { wire, callback, emitWireEvent, registerWire } = createWire();
    registerWire(debounce(wire, 500));
    emitWireEvent('1', '2', '3');

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    emitWireEvent('3', '4');
    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('4');
  });

  it('retrieves the debounce duration from the store', () => {
    const { wire, callback, emitWireEvent, registerWire } = createWire({
      state: { querySuggestions: { config: { debounceInMs: 500 } } }
    });
    registerWire(debounce(wire, store => store.state.x.querySuggestions.config.debounceInMs));
    emitWireEvent('1', '2', '3');

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    emitWireEvent('3', '4');
    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('4');
  });

  it('allows changing the debounced time dynamically', () => {
    const { wire, callback, emitWireEvent, registerWire, store } = createWire({
      state: { querySuggestions: { config: { debounceInMs: 500 } } }
    });
    registerWire(debounce(wire, store => store.state.x.querySuggestions.config.debounceInMs));
    emitWireEvent('1', '2', '3');

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    store.state.x.querySuggestions.config.debounceInMs = 250;
    emitWireEvent('3', '4');
    jest.advanceTimersByTime(249);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('4');
  });

  describe('when there are events that abort the debounce', () => {
    // eslint-disable-next-line max-len
    it(`cancels the emission if the cancelOn event is emitted while the debounce is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      registerWire(debounce(wire, 500, { cancelOn: 'UserClearedQuery' }));
      emitWireEvent('1', '2', '3');

      bus.emit('UserClearedQuery', '');
      jest.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();

      emitWireEvent('4');
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('4');
    });

    // eslint-disable-next-line max-len
    it(`cancels the emission if any of the the cancelOn events is emitted while the debounce is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      registerWire(debounce(wire, 500, { cancelOn: ['UserClearedQuery', 'UserAcceptedAQuery'] }));
      emitWireEvent('1');

      bus.emit('UserClearedQuery', '');
      jest.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();

      emitWireEvent('2');
      bus.emit('UserAcceptedAQuery', 'jumper');
      jest.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();

      emitWireEvent('3');
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('3');
    });
  });

  describe('when there are events that force the wire effect immediately', () => {
    // eslint-disable-next-line max-len
    it(`executes the effect immediately if the forceOn event is emitted while the debounce is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      /* Emitting the forceOn event to ensure that ReplaySubject does not trigger this wire
         immediately if a previous forceOn event was emitted. */
      bus.emit('UserClickedAResult', createResultStub('Random result'));
      registerWire(debounce(wire, 500, { forceOn: 'UserClickedAResult' }));
      emitWireEvent('1', '2');
      expect(callback).not.toHaveBeenCalled();

      bus.emit('UserClickedAResult', createResultStub('Random result'));
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('2');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(1);

      emitWireEvent('3', '4');
      expect(callback).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    // eslint-disable-next-line max-len
    it(`executes the effect immediately if any one of the forceOn events is emitted while the debounce is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      registerWire(debounce(wire, 500, { forceOn: ['UserClickedAResult', 'UserScrolled'] }));
      emitWireEvent('1', '2');
      expect(callback).not.toHaveBeenCalled();

      bus.emit('UserClickedAResult', createResultStub('Random result'));
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('2');

      emitWireEvent('3', '4');
      expect(callback).toHaveBeenCalledTimes(1);

      bus.emit('UserScrolled', 100);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('4');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('when both cancel and force events are provided', () => {
    it(`ignores the cancel event if it is emitted after the force event`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      registerWire(
        debounce(wire, 500, { forceOn: 'UserClickedAResult', cancelOn: 'UserClearedQuery' })
      );
      emitWireEvent('1', '2');
      expect(callback).not.toHaveBeenCalled();

      bus.emit('UserClickedAResult', createResultStub('Random result'));
      bus.emit('UserClearedQuery', '');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('2');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it(`does not emit when the force event is emitted after cancel`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      registerWire(
        debounce(wire, 500, { forceOn: 'UserClickedAResult', cancelOn: 'UserClearedQuery' })
      );
      emitWireEvent('1', '2');
      expect(callback).not.toHaveBeenCalled();

      bus.emit('UserClearedQuery', '');
      jest.advanceTimersByTime(250);
      bus.emit('UserClickedAResult', createResultStub('Random result'));
      expect(callback).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(250);
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });
});
