import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PropsWithType } from '../utils';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';

/**
 * The events bus that allows emitting and subscribing to {@link XEventsTypes}
 */
export interface XBus {
  /**
   * Emits an event with the `void` type associated as payload
   * @param event The event name
   */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /**
   * Emits an event with a non-void payload
   * @param event The event name
   * @param payload The payload of the event
   */
  emit<E extends XEvent>(event: E, payload: XEventPayload<E>): void;
  /**
   * Retrieves the observable for an event
   * @param event The event to retrieve an observable for
   */
  on<E extends XEvent>(event: E): Observable<XEventPayload<E>>;
}

/**
 * Type safe emitters dictionary, where each key is the {@link XEvent} name, and the value is a {@link Subject} of the {@link
 * XEventPayload} type
 */
export type Emitters = { [E in XEvent]?: Subject<XEventPayload<E>> };
