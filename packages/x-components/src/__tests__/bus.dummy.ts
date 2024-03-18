import { Dictionary } from '@empathyco/x-utils';
import { EmittedData, EventPayload, SubjectPayload, XPriorityBus } from '@empathyco/x-bus';
import { Subject } from 'rxjs';
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

/**
 * Dummy function to create an emitter for a given event.
 *
 * @param event - The event to create the emitter for.
 */
export function dummyCreateEmitter<SomeEvent extends keyof XEventsTypes>(
  this: XPriorityBus<any, any>,
  event: SomeEvent
): void {
  this.emitters[event] = new Subject<
    SubjectPayload<EventPayload<XEventsTypes, SomeEvent>, WireMetadata>
  >();
}
