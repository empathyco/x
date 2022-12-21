import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '@empathyco/x-utils';
import { logDevtoolsXEvent } from './devtools/timeline.devtools';
import { Emitter, Emitters, SubjectPayload, XBus, XEvent, XEventPayload } from './x-bus.types';
import { XPriorityQueue } from '@empathyco/x-priority-queue';

const eventsPriorities: Dictionary<number> = {
  RequestChanged: 2,
  DataChanged: 4,
  User: 6,
  Url: 8,
  External: 10,
  DataProvided: 12,
  LifecycleHooks: 12,
  DataReceived: 14
};

/**
 * Default {@link XBus} implementation.
 *
 * @public
 */
export class BaseXBus implements XBus {
  /**
   * Dictionary to store the created event emitters.
   *
   * @internal
   */
  protected emitters: Emitters = {};

  public constructor(protected queue: XPriorityQueue<XEvent> = new XPriorityQueue()) {}

  public pendingFlush!: number;

  /**
   * Emits an event. See {@link XBus.(emit:2)}.
   *
   * @param event - Event to be emitted.
   * @param payload - Event payload.
   * @param metadata - Information of who emits the event.
   */
  async emit<Event extends XEvent>(
    event: Event,
    payload?: XEventPayload<Event>,
    metadata: Dictionary = { moduleName: null }
  ): Promise<void> {
    // Payload is defined here as an optional argument (which is wrong), but as this
    // implementation must be used with the type XBus there is no problem
    const value: SubjectPayload<XEventPayload<Event>> = {
      eventPayload: payload,
      metadata
    };
    // logDevtoolsXEvent(event, value);
    // const emitter = this.getOrCreateEmitter(event);
    // emitter.next(value);
    this.queue.push(event, this.getEventPriority(event), {
      replaceable: false,
      ...value
    });

    await this.flushQueue();
  }

  protected getEventPriority(event: XEvent): number {
    return eventsPriorities[event] ?? Number.MAX_VALUE;
  }

  protected flushQueue(): Promise<void> {
    return new Promise(resolve => {
      this.pendingFlush = setTimeout(() => {
        while (!this.queue.isEmpty()) {
          const element = this.queue.pop();
          if (element) {
            const { metadata } = element;
            const emitter = this.getOrCreateEmitter(element.key);
            emitter.next({
              eventPayload: metadata.eventPayload as any,
              metadata: metadata.metadata as any
            });
          }
        }
        this.queue.clear();
        this.pendingFlush = 0;
        resolve();
      });
    });
  }

  /**
   * Retrieves an observable. See {@link XBus.(on:3)}.
   *
   * @public
   * @param event - Event to listener.
   * @param withMetadata - Option to listener with info about event emitter.
   * @returns The emitter for the event passed.
   */
  on<Event extends XEvent>(
    event: Event,
    withMetadata = false
  ): Observable<SubjectPayload<XEventPayload<Event>> | XEventPayload<Event>> {
    return withMetadata
      ? this.getOrCreateEmitter(event)
      : this.getOrCreateEmitter(event).pipe(map(value => value.eventPayload));
  }

  /**
   * Retrieves an event emitter for a given event.
   *
   * @param event - The event to retrieve the emitter for.
   * @returns The emitter for the event passed.
   * @remarks The emitter is implemented with a
   * {@Link https://www.learnrxjs.io/learn-rxjs/subjects/replaysubject | ReplaySubject} to allow any
   * new subscriber receive the last emitted value.
   * @internal
   */
  protected getOrCreateEmitter<Event extends XEvent>(event: Event): Emitter<Event> {
    // TODO I Don't get why the types are not working here
    return (
      this.emitters[event] ??
      (this.emitters[event] = new ReplaySubject<SubjectPayload<XEventPayload<Event>>>(1) as any)
    );
  }
}

/** @internal The bus instance. Will be replaced by injection. */
export const bus: XBus = new BaseXBus();
// TODO Remove this instantiation and replace with injection where used
