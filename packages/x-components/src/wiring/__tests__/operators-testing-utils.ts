import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { BaseXBus, XBus } from '../../plugins/index';
import { RootXStoreState } from '../../store/index';
import { XEvent, XEventPayload } from '../events.types';
import { createWireFromFunction } from '../wires.factory';
import { Wire } from '../wiring.types';

/**
 * Creates a wire with the given options.
 *
 * @param options - Options to create the wire with.
 * @returns Testing utilities for the given wire.
 */
export function createWire<SomeEvent extends XEvent = 'UserIsTypingAQuery'>({
  event = 'UserIsTypingAQuery' as SomeEvent,
  state
}: CreateWireOptions<SomeEvent> = {}): CreateWireAPI<XEventPayload<SomeEvent>> {
  const vue = createLocalVue();
  vue.use(Vuex);
  const bus: XBus = new BaseXBus();
  const callback = jest.fn();
  const wire = createWireFromFunction<XEventPayload<SomeEvent>>(({ eventPayload }) => {
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
      const observable = bus.on(event, true);
      wire(observable, store, bus.on.bind(bus));
    },
    emitWireEvent(...payloads) {
      payloads.forEach(payload => bus.emit(event, payload));
    }
  };
}

interface CreateWireOptions<SomeEvent extends XEvent> {
  /** The event this wire is going to be associated to. */
  event?: SomeEvent;
  /** A partial state to initialise the store with. */
  state?: DeepPartial<RootXStoreState['x']>;
}

interface CreateWireAPI<Payload> {
  /** Vuex store. */
  store: Store<RootXStoreState>;
  /** The instance of the bus this wire is going to use. */
  bus: XBus;
  /** The created wire. */
  wire: Wire<Payload>;
  /** A jest mock that the wire will execute when triggered. */
  callback: jest.Mock;
  /** Registers the wire to the provided event. */
  registerWire: (wire: Wire<Payload>) => void;
  /** Emits synchronously the given values. */
  emitWireEvent: (...payloads: Payload[]) => void;
}
