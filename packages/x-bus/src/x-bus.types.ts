import { Dictionary } from '@empathyco/x-utils';
import { Observable, Subject } from 'rxjs';

/**
 * Alias representing a positive number to represent the priority of an event in an
 * {@link XPriorityBus}.
 *
 * @internal
 */
export type Priority = number;

/**
 * Extracts the payload type of the event.
 *
 * @remarks If the payload type is void, the returned type is undefined.
 *
 * @public
 */
export type EventPayload<
  SomeEvents extends Dictionary,
  SomeEvent extends keyof SomeEvents
> = SomeEvents[SomeEvent] extends void ? undefined : SomeEvents[SomeEvent];

/**
 * Represents an object including an eventPayload, which type is extracted using
 * {@link EventPayload}, and a metadata which type is taken from the SomeEventMetadata parameter
 * of this type.
 *
 * @public
 */
export interface SubjectPayload<
  SomeEvents extends Dictionary,
  SomeEvent extends keyof SomeEvents,
  SomeEventMetadata extends Dictionary
> {
  /** The payload of the event. */
  eventPayload: EventPayload<SomeEvents, SomeEvent>;
  /** Extra data of the event. */
  metadata: SomeEventMetadata;
}

/**
 * Alias representing a {@link https://rxjs.dev/api/index/class/Subject | Subject} parametrized
 * with the {@link SubjectPayload} of an event.
 *
 * @public
 */
export type Emitter<
  SomeEvents extends Dictionary,
  SomeEvent extends keyof SomeEvents,
  SomeEventMetadata extends Dictionary
> = Subject<SubjectPayload<SomeEvents, SomeEvent, SomeEventMetadata>>;

/**
 * Represents a dictionary where the key is an event name and its value is an {@link Emitter}.
 *
 * @public
 */
export type Emitters<SomeEvents extends Dictionary, SomeEventMetadata extends Dictionary> = {
  [SomeEvent in keyof SomeEvents]?: Emitter<SomeEvents, SomeEvent, SomeEventMetadata>;
};

/**
 * Represents an object containing the data emitted by an event.
 *
 * @public
 */
export interface EmittedData<
  SomeEvents extends Dictionary,
  SomeEvent extends keyof SomeEvents,
  SomeEventMetadata extends Dictionary
> {
  /**
   * The event name.
   */
  event: SomeEvent;
  /**
   * The event payload.
   */
  eventPayload: EventPayload<SomeEvents, SomeEvent>;
  /**
   * The event extra data.
   */
  metadata: SomeEventMetadata;
}

/**
 * Represents the {@link @empathyco/x-priority-queue#XPriorityQueueNode.data | queue node data}
 * in the {@link @empathyco/x-priority-queue#XPriorityQueue | priority queue} of a
 * {@link XPriorityBus}.
 */
export interface XPriorityQueueNodeData<
  SomeEvents extends Dictionary,
  SomeEventMetadata extends Dictionary
> {
  /**
   * The event payload.
   */
  eventPayload: EventPayload<SomeEvents, keyof SomeEvents>;
  /**
   * The event metadata.
   */
  eventMetadata: SomeEventMetadata;
  /**
   * Flag determining if an event is replaceable or not. If a node is replaceable, and an event
   * with the same key is inserted, then, the replaceable event is removed from the key, and the
   * new one is inserted at its corresponding position.
   */
  replaceable: boolean;
  /**
   * The resolve function of the {@link Promise} to be called the moment the event is emitted.
   *
   * @param value - The {@link EmittedData | emitted data}.
   */
  resolve: <SomeEvent extends keyof SomeEvents>(
    value:
      | EmittedData<SomeEvents, SomeEvent, SomeEventMetadata>
      | PromiseLike<EmittedData<SomeEvents, SomeEvent, SomeEventMetadata>>
  ) => void;
}

/**
 * Event bus to emit and subscribe to events.
 *
 * @public
 */
export interface XBus<SomeEvents extends Dictionary, SomeEventMetadata extends Dictionary> {
  /**
   * Emits an event with the `void` type associated as payload.
   *
   * @param event - The event name.
   *
   * @returns A promise that is resolved whenever the event is emitted.
   */
  emit<SomeEvent extends keyof SomeEvents>(
    event: SomeEvent
  ): Promise<EmittedData<SomeEvents, SomeEvent, SomeEventMetadata>>;
  /**
   * Emits an event with a non-void payload.
   *
   * @param event - The event name.
   * @param payload - The payload of the event.
   * @param metadata - The extra data of the event.
   *
   * @returns A promise that is resolved whenever the event is emitted.
   */
  emit<SomeEvent extends keyof SomeEvents>(
    event: SomeEvent,
    payload: EventPayload<SomeEvents, SomeEvent>,
    metadata?: SomeEventMetadata
  ): Promise<EmittedData<SomeEvents, SomeEvent, SomeEventMetadata>>;

  /**
   * Retrieves an observable for an event.
   *
   * @param event - The event to retrieve an observable for.
   * @param withMetadata - If `true` the returned Observable payload will contain the Event
   * payload and the Event metadata. If `false`, the observable payload will only be the event
   * payload.
   *
   * @returns If `withMetadata` is `true`, an Observable of type {@link SubjectPayload}. Otherwise,
   * an observable of type {@link EventPayload}.
   */
  on<SomeEvent extends keyof SomeEvents>(
    event: SomeEvent,
    withMetadata?: boolean
  ): typeof withMetadata extends true
    ? Observable<SubjectPayload<SomeEvents, SomeEvent, SomeEventMetadata>>
    : Observable<EventPayload<SomeEvents, SomeEvent>>;
}
