import type { AnyFunction, Dictionary } from '@empathyco/x-utils'
import type { Observable } from 'rxjs'
import type {
  EmittedData,
  Emitter,
  Emitters,
  EventPayload,
  Priority,
  SubjectPayload,
  XBus,
  XPriorityQueueNodeData,
} from './x-bus.types'
import type { XPriorityQueue } from './x-priority-queue'
import { ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { BaseXPriorityQueue } from './x-priority-queue'

/**
 * A default {@link XBus} implementation using a
 * {@link XPriorityQueue | priority queue} as its data structure to
 * prioritise the emission of events. The priorities are preconfigured based on event naming.
 *
 * @public
 */
export class XPriorityBus<SomeEvents extends Dictionary, SomeEventMetadata extends Dictionary>
  implements XBus<SomeEvents, SomeEventMetadata>
{
  /**
   * A {@link XPriorityQueue | priority queue} to store the events to
   * emit.
   *
   * @internal
   */
  protected queue: XPriorityQueue<SomeEvents, XPriorityQueueNodeData<SomeEvents, SomeEventMetadata>>

  /**
   * A dictionary associating a priority to a key.
   *
   * @example
   * ```ts
   * const priorities: Dictionary<number> = {
   *   '^StartsWith': 2,
   *   Contains: 4,
   *   EndWith$: 8
   * }
   * ```
   *
   * @internal
   */
  protected priorities: Dictionary<Priority>

  /**
   * The default value to use as priority for an event that doesn't have defined neither a custom
   * priority nor its name doesn't match any key of the {@link XPriorityBus.priorities | priorities} dictionary.
   *
   * @internal
   */
  protected defaultEventPriority: number

  /**
   * A list of functions to execute when an event is emitted.
   *
   * @internal
   */
  protected emitCallbacks: AnyFunction[]

  /**
   * A dictionary to store the created event emitters.
   *
   * @internal
   */
  protected emitters: Emitters<SomeEvents, SomeEventMetadata> = {}

  /**
   * A pending flush operation timeout identifier or undefined if there's none pending.
   *
   * @internal
   */
  protected pendingFlushId?: number

  /**
   * A list of pending pop operations timeout identifiers.
   *
   * @internal
   */
  protected pendingPopsIds: number[] = []

  /**
   * Creates a new instance of a {@link XPriorityBus}.
   *
   * @param config - A configuration object to initialise the bus.
   * @param config.queue - A {@link XPriorityQueue | priority queue} to store the events.
   * @param config.priorities - A Dictionary defining the priorities associated to a given string.
   * @param config.emitCallbacks - A list of functions to execute when an event is emitted.
   * @param config.defaultEventPriority - A default priority to assigned to an event.
   */
  public constructor(
    config: {
      queue?: XPriorityQueue<SomeEvents, XPriorityQueueNodeData<SomeEvents, SomeEventMetadata>>
      priorities?: Dictionary<number>
      emitCallbacks?: AnyFunction[]
      defaultEventPriority?: number
    } = {},
  ) {
    this.queue =
      config.queue ??
      new BaseXPriorityQueue<SomeEvents, XPriorityQueueNodeData<SomeEvents, SomeEventMetadata>>()
    this.priorities = config.priorities ?? {}
    this.emitCallbacks = config.emitCallbacks ?? []
    this.defaultEventPriority = config.defaultEventPriority ?? Number.MIN_SAFE_INTEGER
  }

  /**
   * Emits an event. See {@link XBus.emit}.
   *
   * @param event - Event to be emitted.
   * @param payload - Event payload.
   * @param metadata - Extra event data.
   *
   * @returns A promise that is resolved the moment the event is emitted.
   */
  // eslint-disable-next-line ts/promise-function-async
  emit<SomeEvent extends keyof SomeEvents>(
    event: SomeEvent,
    // TODO: Fix optional argument.
    payload?: EventPayload<SomeEvents, SomeEvent>,
    metadata = {} as SomeEventMetadata,
  ): Promise<EmittedData<SomeEvents, SomeEvent, SomeEventMetadata>> {
    return new Promise(resolve => {
      this.queue.push(event, this.getEventPriority(event, metadata), {
        // This type assertion is done because payload is optional.
        eventPayload: payload as EventPayload<SomeEvents, SomeEvent>,
        eventMetadata: metadata,
        replaceable: metadata.replaceable || false,
        // TODO: Fix type.
        resolve: resolve as any,
      })

      this.flushQueue()
    })
  }

  /**.
   * Retrieves the event priority based on:
   * - the defined event metadata priority
   * - the priority associated to the matching preconfigured priority key
   * - the configured {@link XPriorityBus.defaultEventPriority | defaultEventPriority} is assigned (by default, the min safe integer).
   *
   * @param event - The event to get the priority from.
   * @param metadata - The event metadata.
   *
   * @returns The priority for the given event.
   *
   * @internal
   */
  protected getEventPriority(event: keyof SomeEvents, metadata: SomeEventMetadata): Priority {
    if (metadata.priority != null) {
      return metadata.priority
    }

    const matchingKey = Object.keys(this.priorities).find(key => String(event).includes(key))
    if (matchingKey) {
      return this.priorities[matchingKey]
    }

    return this.defaultEventPriority
  }

  /**
   * Processes the events stored in the
   * {@link XPriorityQueue | priority queue} and resolves each event
   * whenever it is emitted.
   *
   * @remarks If another 'flushQueue' operation is running, it is discarded and a new one is
   * executed. The pending popping operations are also discarded.
   *
   * @internal
   */
  protected flushQueue(): void {
    clearTimeout(this.pendingFlushId)
    this.clearPendingPopsIds()

    this.pendingFlushId = window.setTimeout(() => {
      for (let i = 0; i < this.queue.size(); ++i) {
        const popTimeoutId = window.setTimeout(() => {
          const {
            key,
            data: { eventPayload, eventMetadata, resolve },
          } = this.queue.pop()!
          const emitter = this.getEmitter(key)
          const payloadObj = {
            eventPayload,
            metadata: eventMetadata,
          }

          emitter.next(payloadObj)

          this.emitCallbacks.forEach(callback => callback(key, payloadObj))
          resolve({ event: key, ...payloadObj })

          this.pendingPopsIds = this.pendingPopsIds.filter(timeoutId => timeoutId !== popTimeoutId)
        })

        this.pendingPopsIds.push(popTimeoutId)
      }
    })
  }

  /**
   * Discards existing pending pop operations and empties the array.
   *
   * @internal
   */
  private clearPendingPopsIds(): void {
    this.pendingPopsIds.forEach(clearTimeout)
    this.pendingPopsIds.length = 0
  }

  /**
   * Retrieves an observable for the event. See {@link XBus.on}.
   *
   * @param event - Event to retrieve the observable for.
   * @param withMetadata - Option to retrieve an observable with extra data about the event.
   *
   * @returns The emitter for the event passed.
   */
  on<SomeEvent extends keyof SomeEvents>(
    event: SomeEvent,
    withMetadata = false,
  ): typeof withMetadata extends true
    ? Observable<SubjectPayload<EventPayload<SomeEvents, SomeEvent>, SomeEventMetadata>>
    : Observable<EventPayload<SomeEvents, SomeEvent>> {
    // TODO: This type should work, but inference isn't working as expected. Check when updating ts.
    return withMetadata
    // @ts-expect-error Type is not assignable to type EventPayload<SomeEvents, SomeEvent
      ? this.getEmitter(event).asObservable()
      : this.getEmitter(event).pipe(
          map<
            SubjectPayload<EventPayload<SomeEvents, SomeEvent>, SomeEventMetadata>,
            EventPayload<SomeEvents, SomeEvent>
          >(value => value.eventPayload),
        )
  }

  /**
   * Retrieves an event {@link Emitter} for the given event.
   *
   * @param event - The event to retrieve the {@link Emitter} for.
   *
   * @returns The {@link Emitters} for the passed event.
   *
   * @internal
   */
  protected getEmitter<SomeEvent extends keyof SomeEvents>(
    event: SomeEvent,
  ): Emitter<SomeEvents, SomeEvent, SomeEventMetadata> {
    if (!this.emitters[event]) {
      this.createEmitter(event)
    }

    return this.emitters[event]!
  }

  /**
   * Creates an event {@link Emitter} for the given event.
   *
   * @remarks The emitter is implemented with a
   * {@Link https://www.learnrxjs.io/learn-rxjs/subjects/replaysubject | ReplaySubject} to allow any
   * new subscriber receive the last emitted value.
   *
   * @param event - The event to create the {@link Emitter} for.
   *
   * @internal
   */
  protected createEmitter<SomeEvent extends keyof SomeEvents>(event: SomeEvent): void {
    this.emitters[event] = new ReplaySubject<
      SubjectPayload<EventPayload<SomeEvents, SomeEvent>, SomeEventMetadata>
    >(1)
  }
}
