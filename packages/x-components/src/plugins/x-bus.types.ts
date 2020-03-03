import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PropsWithType } from '../utils';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';

/**
 * The events bus that allows emitting and subscribing to {@link XEventsTypes}
 * @public
 */
export interface XBus {
  /**
   * Emits an event with the `void` type associated as payload
   *
   * @param event - The event name
   */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /**
   * Emits an event with a non-void payload
   *
   * @param event - The event name
   * @param payload - The payload of the event
   */
  emit<Event extends XEvent>(event: Event, payload: XEventPayload<Event>): void;
  /**
   * Retrieves the observable for an event
   *
   * @param event - The event to retrieve an observable for
   */
  on<Event extends XEvent>(event: Event): Observable<XEventPayload<Event>>;
}

/**
 * Type safe emitters dictionary, where each key is the {@link XEvent} name,
 * and the value is a {@link https://rxjs.dev/api/index/class/Subject} of the {@link XEventPayload} type
 * @public
 */
export type Emitters = { [Event in XEvent]?: Subject<XEventPayload<Event>> };
