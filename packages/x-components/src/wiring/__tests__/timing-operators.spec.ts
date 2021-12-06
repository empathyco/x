import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createResultStub } from '../../__stubs__/results-stubs.factory';
import { BaseXBus } from '../../plugins/x-bus';
import { XBus } from '../../plugins/x-bus.types';
import { RootXStoreState } from '../../store/store.types';
import { DeepPartial } from '../../utils/types';
import { createWireFromFunction } from '../wires.factory';
import { debounce } from '../wires.operators';
import { Wire } from '../wiring.types';

function createWire({ state }: CreateWireOptions = {}): CreateWireAPI {
  const vue = createLocalVue();
  vue.use(Vuex);
  const bus: XBus = new BaseXBus();
  const callback = jest.fn();
  const wire = createWireFromFunction<string>(({ eventPayload }) => {
    callback(eventPayload);
  });
  const store = new Store<DeepPartial<RootXStoreState>>({
    state: { x: state }
  }) as Store<RootXStoreState>;

  return {
    store,
    wire,
    bus,
    callback,
    registerWire(wire) {
      const observable = bus.on('UserIsTypingAQuery', true);
      wire(observable, store, bus.on.bind(bus));
    },
    emit(...payloads) {
      payloads.forEach(payload => bus.emit('UserIsTypingAQuery', payload));
    }
  };
}

describe('testing timing operators', () => {
  beforeAll(jest.useFakeTimers);
  afterAll(jest.useRealTimers);

  describe(`testing ${debounce.name} operator`, () => {
    it('discards emitted values that take less than the specified time between output', () => {
      const { wire, callback, emit, registerWire } = createWire();
      registerWire(debounce(wire, 500));
      emit('1', '2', '3');

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(499);
      expect(callback).not.toHaveBeenCalled();

      emit('3', '4');
      jest.advanceTimersByTime(499);
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('4');
    });

    it('retrieves the debounce duration from the store', () => {
      const { wire, callback, emit, registerWire } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 500 } } }
      });
      registerWire(debounce(wire, store => store.state.x.querySuggestions.config.debounceInMs));
      emit('1', '2', '3');

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(499);
      expect(callback).not.toHaveBeenCalled();

      emit('3', '4');
      jest.advanceTimersByTime(499);
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('4');
    });

    it('allows changing the debounced time dynamically', () => {
      const { wire, callback, emit, registerWire, store } = createWire({
        state: { querySuggestions: { config: { debounceInMs: 500 } } }
      });
      registerWire(debounce(wire, store => store.state.x.querySuggestions.config.debounceInMs));
      emit('1', '2', '3');

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(499);
      expect(callback).not.toHaveBeenCalled();

      store.state.x.querySuggestions.config.debounceInMs = 250;
      emit('3', '4');
      jest.advanceTimersByTime(249);
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('4');
    });

    describe('when there are events that abort the debounce', () => {
      // eslint-disable-next-line max-len
      it(`cancels the emission if the cancelOn event is emitted while the debounce is running`, () => {
        const { wire, callback, emit, registerWire, bus } = createWire();
        registerWire(debounce(wire, 500, { cancelOn: 'UserClearedQuery' }));
        emit('1', '2', '3');

        bus.emit('UserClearedQuery', '');
        jest.advanceTimersByTime(500);
        expect(callback).not.toHaveBeenCalled();
      });

      // eslint-disable-next-line max-len
      it(`cancels the emission if any of the the cancelOn events is emitted while the debounce is running`, () => {
        const { wire, callback, emit, registerWire, bus } = createWire();
        registerWire(debounce(wire, 500, { cancelOn: ['UserClearedQuery', 'UserAcceptedAQuery'] }));
        emit('1');

        bus.emit('UserClearedQuery', '');
        jest.advanceTimersByTime(500);
        expect(callback).not.toHaveBeenCalled();

        emit('2');
        bus.emit('UserAcceptedAQuery', 'jumper');
        jest.advanceTimersByTime(500);
        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('when there are events that force the wire effect immediately', () => {
      // eslint-disable-next-line max-len
      it(`executes the effect immediately if the forceOn event is emitted while the debounce is running`, () => {
        const { wire, callback, emit, registerWire, bus } = createWire();
        /* Emitting the forceOn event to ensure that ReplaySubject does not trigger this wire
        immediately if a previous forceOn event was emitted. */
        bus.emit('UserClickedAResult', createResultStub('Random result'));
        registerWire(debounce(wire, 500, { forceOn: 'UserClickedAResult' }));
        emit('1', '2');
        expect(callback).not.toHaveBeenCalled();

        bus.emit('UserClickedAResult', createResultStub('Random result'));
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('2');

        jest.advanceTimersByTime(500);
        expect(callback).toHaveBeenCalledTimes(1);

        emit('3', '4');
        expect(callback).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(500);
        expect(callback).toHaveBeenCalledTimes(2);
      });

      // eslint-disable-next-line max-len
      it(`executes the effect immediately if any one of the forceOn events is emitted while the debounce is running`, () => {
        const { wire, callback, emit, registerWire, bus } = createWire();
        registerWire(debounce(wire, 500, { forceOn: ['UserClickedAResult', 'UserScrolled'] }));
        emit('1', '2');
        expect(callback).not.toHaveBeenCalled();

        bus.emit('UserClickedAResult', createResultStub('Random result'));
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('2');

        emit('3', '4');
        expect(callback).toHaveBeenCalledTimes(1);

        bus.emit('UserScrolled', 100);
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith('4');

        jest.advanceTimersByTime(500);
        expect(callback).toHaveBeenCalledTimes(2);
      });

      it(`ignores cancelOn events when the forceOn event is emitted`, () => {
        const { wire, callback, emit, registerWire, bus } = createWire();
        registerWire(
          debounce(wire, 500, { forceOn: 'UserClickedAResult', cancelOn: 'UserClearedQuery' })
        );
        emit('1', '2');
        expect(callback).not.toHaveBeenCalled();

        bus.emit('UserClickedAResult', createResultStub('Random result'));
        bus.emit('UserClearedQuery', '');
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('2');

        jest.advanceTimersByTime(500);
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });
});

interface CreateWireOptions {
  state?: DeepPartial<RootXStoreState['x']>;
}

interface CreateWireAPI {
  store: Store<RootXStoreState>;
  bus: XBus;
  wire: Wire<string>;
  callback: jest.Mock;
  registerWire: (wire: Wire<string>) => void;
  emit: (...payloads: string[]) => void;
}
