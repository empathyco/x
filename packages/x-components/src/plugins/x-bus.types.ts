import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PropsWithType } from '../utils';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';
import { WireMetadata, WirePayload } from '../wiring/wiring.types';

/**
 * The events bus that allows emitting and subscribing to {@link XEventsTypes}.
 *
 * @public
 */
export interface XBus {
  /**
   * Emits an event with the `void` type associated as payload.
   *
   * @param event - The event name.
   */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /**
   * Emits an event with a non-void payload.
   *
   * @param event - The event name.
   * @param payload - The payload of the event.
   * @param metadata - The {@link WireMetadata | metadata} of the event.
   */
  emit<Event extends XEvent>(
    event: Event,
    payload: XEventPayload<Event>,
    metadata?: WireMetadata
  ): void;

  /**
   * Retrieves the observable for an event.
   *
   * @param event - The event to retrieve an observable for.
   * @param withMetadata - When set to `true`, the returned observable payload will be a
   * {@link WirePayload}.
   * @returns An Observable of {@link WirePayload} object containing the event payload and the
   * event metadata.
   */
  on<Event extends XEvent>(
    event: Event,
    withMetadata: true
  ): Observable<WirePayload<XEventPayload<Event>>>;
  /**
   * Retrieves the observable for an event.
   *
   * @param event - The event to retrieve an observable for.
   * @param withMetadata - When set to `false`, the observable payload will be the Event
   * payload.
   * @returns An Observable of the event payload.
   */
  on<Event extends XEvent>(event: Event, withMetadata?: false): Observable<XEventPayload<Event>>;
  /**
   * Retrieves the observable for an event.
   *
   * @param event - The event to retrieve an observable for.
   * @param withMetadata - If `true` the returned Observable payload will contain the Event
   * payload and the Event metadata. If `false`, the observable payload will only be the event
   * payload.
   * @returns If `withMetadata` is `true`, an Observable of {@link WirePayload} object
   * containing the event payload and more metadata. If `withMetadata` is `false`, an Observable
   * of the Event payload.
   */
  on<Event extends XEvent>(
    event: Event,
    withMetadata: boolean
  ): Observable<XEventPayload<Event> | WirePayload<XEventPayload<Event>>>;
}

/**
 * Type safe emitters dictionary, where each key is the {@link XEvent} name,
 * and the value is a {@link https://rxjs.dev/api/index/class/Subject} of the
 * {@link XEventPayload} type.
 *
 * @public
 */
export type Emitters = {
  [Event in XEvent]?: Emitter<Event>;
};

/**
 * Type safe for emitter payload. It is the wire payload.
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type.
 * @public
 */
export type Emitter<Event extends XEvent> = Subject<WirePayload<XEventPayload<Event>>>;
