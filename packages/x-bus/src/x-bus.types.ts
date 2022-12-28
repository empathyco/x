import { Observable, Subject } from 'rxjs';
import {AnyFunction, Dictionary, Keys} from '@empathyco/x-utils';

/**
 * Alias representing a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value | timeoutID}
 * value.
 *
 * @internal
 */
export type TimeoutId = number;

/**
 * Alias representing a positive number to represent the priority of an {@link XEvent} in an
 * {@link XPriorityBus}.
 *
 * @internal
 */
export type Priority = number;

/**
 * Alias representing a dictionary where the key is the name of the {@link XEvent} and the type
 * is its payload type.
 */
export type XEvents = Dictionary;

/**
 * Alias representing the name of an {@link XEvent}.
 *
 * @internal
 */
export type XEvent = keyof XEvents;

/**
 * Extracts the payload type of a {@link XEvent}.
 *
 * @internal
 */
export type XEventPayload<Event extends XEvent> = XEvents[Event] extends void
  ? undefined
  : XEvents[Event];

/**
 * Represents the payload of a subject with a given type.
 *
 * @internal
 */
export type SubjectPayload<SomePayload> = {
  /** The payload of the event. */
  eventPayload: SomePayload;
  /** Extra data of the event. */
  metadata: Dictionary;
};

/**
 * Type safe for emitter payload. It is the wire payload.
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type.
 * @public
 */
export type Emitter<Event extends XEvent> = Subject<SubjectPayload<XEventPayload<Event>>>;

/**
 * Type safe emitter's dictionary, where each key is the {@link XEvent} name, and the value is a
 * {@link https://rxjs.dev/api/index/class/Subject} of the {@link XEventPayload} type.
 *
 * @public
 */
export type Emitters = {
  [Event in XEvent]?: Emitter<Event>;
};

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
   * @returns A promise that is resolved whenever the event is emitted.
   */
  emit(event: Keys<XEvents, void>): Promise<XEvent> | void;
  /**
   * Emits an event with a non-void payload.
   *
   * @param event - The event name.
   * @param payload - The payload of the event.
   * @param metadata - The extra data of the event.
   */
  emit<Event extends keyof XEvents>(
    event: Event,
    payload: XEventPayload<Event>,
    metadata?: Dictionary
  ): Promise<XEvent> | void;

  /**
   * Retrieves the observable for an event.
   *
   * @param event - The event to retrieve an observable for.
   * @param withMetadata - When set to `true`, the returned observable payload will be a
   * {@link WirePayload}.
   * @returns An Observable of {@link WirePayload} object containing the event payload and the
   * event metadata.
   */
  on<Event extends keyof XEvents>(
    event: Event,
    withMetadata: true
  ): Observable<SubjectPayload<XEventPayload<Event>>>;
  /**
   * Retrieves the observable for an event.
   *
   * @param event - The event to retrieve an observable for.
   * @param withMetadata - When set to `false`, the observable payload will be the Event payload.
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
  ): Observable<XEventPayload<Event> | SubjectPayload<XEventPayload<Event>>>;
}
