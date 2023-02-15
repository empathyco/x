import { Dictionary } from '@empathyco/x-utils';
import { EmittedData, EventPayload, XPriorityBus } from '@empathyco/x-bus';
import { WireMetadata, XEventsTypes } from '../wiring';

export class XDummyBus<
  SomeEvents extends Dictionary = XEventsTypes,
  SomeMetadata extends Dictionary = WireMetadata
> extends XPriorityBus<SomeEvents, SomeMetadata> {
  emit<SomeEvent extends keyof SomeEvents>(
    event: SomeEvent,
    payload?: EventPayload<SomeEvents, SomeEvent>,
    metadata = {} as SomeMetadata
  ): Promise<EmittedData<SomeEvents, SomeEvent, SomeMetadata>> {
    const emitter = this.getEmitter(event);
    const emittedPayload = {
      eventPayload: payload as EventPayload<SomeEvents, SomeEvent>,
      metadata
    };

    emitter.next(emittedPayload);

    return Promise.resolve({ event, ...emittedPayload });
  }
}
