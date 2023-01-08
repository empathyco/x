import { XPriorityQueue } from '@empathyco/x-priority-queue';
import { AnyFunction, Dictionary } from '@empathyco/x-utils';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  EmittedData,
  Emitter,
  Emitters,
  Priority,
  SubjectPayload,
  TimeoutId,
  XBus,
  XEvent,
  XEventPayload
} from './x-bus.types';

declare module '@empathyco/x-priority-queue' {
  export interface XPriorityQueueNodeMetadata {
    resolve: (value: EmittedData<XEvent>) => void;
    eventPayload: any;
    eventMetadata: any;
  }
}

/**
 * A {@link XBus} implementation using an {@link XPriorityQueue} as its data structure to
 * prioritise the emission of events. The priorities are preconfigured based on event naming.
 *
 * @public
 */
export class XPriorityBus implements XBus {
  /**
   *
   *
   * @internal
   */
  protected queue: XPriorityQueue<XEvent>;

  /**
   *
   *
   * @internal
   */
  protected priorities: Dictionary<number>;

  /**
   *
   *
   * @internal
   */
  protected emitCallbacks: AnyFunction[];

  /**
   * A dictionary to store the created event emitters.
   *
   * @internal
   */
  protected emitters: Emitters = {};

  /**
   * A pending flush operation {@link TimeoutId | timeout identifier} or undefined if there's
   * none pending.
   *
   * @internal
   */
  protected pendingFlush?: TimeoutId;

  /**
   * A list of pending pop operations {@link TimeoutId | timeout identifiers}.
   *
   * @internal
   */
  protected pendingPops: TimeoutId[] = [];

  /**
   * Creates a new instance of a {@link XPriorityBus}.
   *
   * @param config
   * @param queue - A {@link XPriorityQueue} to store the events.
   * @param priorities - A {@link @empathyco/x-utils#Dictionary} defining the priorities associated
   * to a given string.
   */
  public constructor(
    config: {
      queue?: XPriorityQueue;
      priorities?: Dictionary<number>;
      emitCallbacks?: AnyFunction[];
    } = {}
  ) {
    this.queue = config.queue ?? new XPriorityQueue();
    this.priorities = config.priorities ?? {
      RequestChanged$: 2,
      Changed$: 4,
      '^User': 6,
      FromUrl$: 8,
      '^External': 10,
      Provided$: 12,
      Hook$: 12,
      Received$: 14
    };
    this.emitCallbacks = config.emitCallbacks ?? [];
  }

  /**
   * Emits an event. See {@link XBus.(emit:2)}.
   *
   * @param event - Event to be emitted.
   * @param payload - Event payload.
   * @param metadata - Extra event data.
   *
   * @returns A promise that is resolved whenever the emitted is truly emitted.
   */
  emit<Event extends XEvent>(
    event: Event,
    payload?: XEventPayload<Event>,
    metadata: Dictionary = { moduleName: null }
  ): Promise<EmittedData<XEvent>> {
    return new Promise(resolve => {
      this.queue.push(event, this.getEventPriority(event, metadata), {
        replaceable: metadata.replaceable || false,
        resolve,
        eventPayload: payload,
        eventMetadata: metadata
      });

      this.flushQueue();
    });
  }

  /**.
   * Retrieves the event priority. The criteria to get the priority is:
   * - the defined event metadata priority
   * - the priority associated to the matching preconfigured priority key
   * - the max positive value is assigned
   *
   * @param event - The {@link XEvent | event} to get the priority from.
   * @param metadata - The {@link XEvent | event} metadata.
   * @returns The priority for the given {@link XEvent | event}.
   *
   * @internal
   */
  getEventPriority(event: XEvent, metadata: Dictionary): Priority {
    const [, priorityKey] = Object.keys(this.priorities).reduce(
      ([matchedCount, matchedName], name) => {
        const count = event.match(new RegExp(name))?.[0].length ?? 0;

        return count > matchedCount ? [count, name] : [matchedCount, matchedName];
      },
      [0, ''] as [count: number, priorityKey: string]
    );

    return metadata.priority ?? this.priorities[priorityKey] ?? Number.MAX_VALUE;
  }

  /**
   * Processes the events stored in the {@link XPriorityQueue | queue} and resolves each
   * {@link XEvent | event} whenever it is emitted.
   *
   * @remarks If another 'flushQueue' was running, it is cleared and a new one is executed. The
   * pending popping operations are also cleared.
   *
   * @internal
   */
  protected flushQueue(): void {
    clearTimeout(this.pendingFlush);
    this.clearPendingPops();

    this.pendingFlush = setTimeout(() => {
      for (let i = 0; i < this.queue.size(); ++i) {
        const popTimeoutId = setTimeout(() => {
          const {
            key,
            metadata: { eventPayload, eventMetadata, resolve }
          } = this.queue.pop()!;
          const emitter = this.getEmitter(key);
          const payloadObj = {
            eventPayload,
            metadata: eventMetadata
          };

          emitter.next(payloadObj);

          this.emitCallbacks.forEach(callback => callback(key, payloadObj));
          resolve({ event: key, ...payloadObj });

          this.pendingPops = this.pendingPops.filter(timeoutId => timeoutId !== popTimeoutId);
        }) as unknown as number;

        this.pendingPops.push(popTimeoutId);
      }
    }) as unknown as number;
  }

  private clearPendingPops(): void {
    this.pendingPops.forEach(clearTimeout);
    this.pendingPops.length = 0;
  }

  /**
   * Retrieves an observable. See {@link XBus.(on:3)}.
   *
   * @param event - Event to listener.
   * @param withMetadata - Option to listener with info about event emitter.
   * @returns The emitter for the event passed.
   */
  on<Event extends XEvent>(
    event: Event,
    withMetadata = false
  ): Observable<SubjectPayload<XEventPayload<Event>> | XEventPayload<Event>> {
    return withMetadata
      ? this.getEmitter(event)
      : this.getEmitter(event).pipe(map(value => value.eventPayload));
  }

  /**
   * Retrieves an event emitter for the given event.
   *
   * @param event - The event to retrieve the emitter for.
   * @returns The emitter for the passed event.
   *
   * @internal
   */
  protected getEmitter<Event extends XEvent>(event: Event): Emitter<Event> {
    if (!this.emitters[event]) {
      this.createEmitter(event);
    }

    return this.emitters[event]!;
  }

  /**
   * Creates an event emitter for the given event.
   *
   * @remarks The emitter is implemented with a
   * {@Link https://www.learnrxjs.io/learn-rxjs/subjects/replaysubject | ReplaySubject} to allow any
   * new subscriber receive the last emitted value.
   *
   * @param event - The event to create the emitter for.
   *
   * @internal
   */
  protected createEmitter<Event extends XEvent>(event: Event): void {
    this.emitters[event] = new ReplaySubject<SubjectPayload<XEventPayload<Event>>>(1);
  }
}
