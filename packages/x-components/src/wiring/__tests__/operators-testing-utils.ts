import type { DeepPartial } from '@empathyco/x-utils'
import type { Observable } from 'rxjs'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../store/index'
import type { EventPayload, SubjectPayload, XBus } from '../../x-bus'
import type { XEvent, XEventPayload, XEventsTypes } from '../events.types'
import type { Wire, WireMetadata } from '../wiring.types'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { XDummyBus } from '../../__tests__/bus.dummy'
import { createWireFromFunction } from '../wires.factory'

/**
 * Creates a wire with the given options.
 *
 * @param options - Options to create the wire with.
 * @param options.event - event option.
 * @param options.state - state option.
 * @returns Testing utilities for the given wire.
 */
export function createWire<SomeEvent extends XEvent = 'UserIsTypingAQuery'>({
  event = 'UserIsTypingAQuery' as SomeEvent,
  state,
}: CreateWireOptions<SomeEvent> = {}): CreateWireAPI<XEventPayload<SomeEvent>> {
  const store = createStore({
    state: { x: state },
  }) as Store<RootXStoreState>
  mount({}, { global: { plugins: [store] } })
  const bus = new XDummyBus()
  const callback = jest.fn()
  const wire = createWireFromFunction<XEventPayload<SomeEvent>>(({ eventPayload }) => {
    callback(eventPayload)
  })

  return {
    store,
    wire,
    bus,
    callback,
    registerWire(wire) {
      const observable = bus.on(event, true) as unknown as Observable<
        SubjectPayload<EventPayload<XEventsTypes, SomeEvent>, WireMetadata>
      >
      wire(observable, store, bus.on.bind(bus))
    },
    emitWireEvent(...payloads) {
      // eslint-disable-next-line ts/no-misused-promises
      payloads.forEach(async payload => bus.emit(event, payload))
    },
  }
}

interface CreateWireOptions<SomeEvent extends XEvent> {
  /** The event this wire is going to be associated to. */
  event?: SomeEvent
  /** A partial state to initialise the store with. */
  state?: DeepPartial<RootXStoreState['x']>
}

interface CreateWireAPI<Payload> {
  /** Vuex store. */
  store: Store<RootXStoreState>
  /** The instance of the bus this wire is going to use. */
  bus: XBus<XEventsTypes, WireMetadata>
  /** The created wire. */
  wire: Wire<Payload>
  /** A jest mock that the wire will execute when triggered. */
  callback: jest.Mock
  /** Registers the wire to the provided event. */
  registerWire: (wire: Wire<Payload>) => void
  /** Emits synchronously the given values. */
  emitWireEvent: (...payloads: Payload[]) => void
}
