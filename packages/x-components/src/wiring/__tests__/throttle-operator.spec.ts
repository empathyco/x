import { createResultStub } from '../../__stubs__/results-stubs.factory';
import { throttle } from '../wires.operators';
import { createWire } from './operators-testing-utils';

describe(`testing ${throttle.name} operator`, () => {
  beforeAll(jest.useFakeTimers);
  afterAll(jest.useRealTimers);

  it('emits value immediately, then ignores the next values for the defined time', () => {
    const { wire, callback, emitWireEvent, registerWire } = createWire();
    registerWire(throttle(wire, 500));
    emitWireEvent('1', '2');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('1');

    jest.advanceTimersByTime(499);
    emitWireEvent('3');
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('3');

    emitWireEvent('4');
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith('4');
  });

  it('retrieves the throttle duration from the store', () => {
    const { wire, callback, emitWireEvent, registerWire } = createWire({
      state: { querySuggestions: { config: { debounceInMs: 500 } } }
    });
    registerWire(throttle(wire, store => store.state.x.querySuggestions.config.debounceInMs));
    emitWireEvent('1', '2');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('1');

    jest.advanceTimersByTime(499);
    emitWireEvent('3');
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('3');
  });

  it('allows changing the throttled time dynamically', () => {
    const { wire, callback, emitWireEvent, registerWire, store } = createWire({
      state: { querySuggestions: { config: { debounceInMs: 500 } } }
    });
    registerWire(throttle(wire, store => store.state.x.querySuggestions.config.debounceInMs));
    emitWireEvent('1', '2');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('1');

    jest.advanceTimersByTime(249);
    emitWireEvent('3');
    expect(callback).toHaveBeenCalledTimes(1);

    store.state.x.querySuggestions.config.debounceInMs = 250;
    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1); /* We still haven't run the new timer until
     the previous one has completed. */

    jest.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('3');

    emitWireEvent('4');
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith('4');
  });

  describe('when there are events that abort the throttle', () => {
    // eslint-disable-next-line max-len
    it(`aborts the throttle if the cancelOn event is emitted while the throttling is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      registerWire(throttle(wire, 500, { cancelOn: 'UserClearedQuery' }));
      emitWireEvent('1');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('1');

      bus.emit('UserClearedQuery', '');
      expect(callback).toHaveBeenCalledTimes(1);

      emitWireEvent('2', '3');
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('2');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledWith('3');
      expect(callback).toHaveBeenCalledTimes(3);
    });

    // eslint-disable-next-line max-len
    it(`cancels the emission if any of the the cancelOn events is emitted while the throttling is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      registerWire(throttle(wire, 500, { cancelOn: ['UserClearedQuery', 'UserAcceptedAQuery'] }));

      emitWireEvent('1');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('1');

      bus.emit('UserClearedQuery', '');
      expect(callback).toHaveBeenCalledTimes(1);

      emitWireEvent('2');
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('2');

      emitWireEvent('3');
      expect(callback).toHaveBeenCalledTimes(2);

      bus.emit('UserAcceptedAQuery', 'jumper');
      expect(callback).toHaveBeenCalledTimes(2);

      emitWireEvent('4');
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith('4');
    });
  });

  describe('when there are events that force the wire effect immediately', () => {
    // eslint-disable-next-line max-len
    it(`executes the effect immediately if the forceOn event is emitted while the throttling is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      /* Emitting the forceOn event to ensure that ReplaySubject does not trigger this wire
         immediately if a previous forceOn event was emitted. */
      bus.emit('UserClickedAResult', createResultStub('Random result'));
      registerWire(throttle(wire, 500, { forceOn: 'UserClickedAResult' }));

      emitWireEvent('1', '2');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('1');

      bus.emit('UserClickedAResult', createResultStub('Random result'));
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('2');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(2);

      emitWireEvent('3', '4', '5');
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith('3');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith('5');
    });

    // eslint-disable-next-line max-len
    it(`executes the effect immediately if any one of the forceOn events is emitted while the throttling is running`, () => {
      const { wire, callback, emitWireEvent, registerWire, bus } = createWire();
      /* Emitting the forceOn event to ensure that ReplaySubject does not trigger this wire
       immediately if a previous forceOn event was emitted. */
      bus.emit('UserClickedAResult', createResultStub('Random result'));
      registerWire(throttle(wire, 500, { forceOn: ['UserClickedAResult', 'UserScrolled'] }));

      emitWireEvent('1', '2');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('1');

      bus.emit('UserClickedAResult', createResultStub('Random result'));
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('2');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(2);

      emitWireEvent('3', '4', '5');
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith('3');

      bus.emit('UserScrolled', 1000);
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith('5');

      jest.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(4);
    });
  });
});
