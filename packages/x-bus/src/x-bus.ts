import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnyFunction, Dictionary } from '@empathyco/x-utils';
import { XPriorityQueue } from '@empathyco/x-priority-queue';
import { Emitter, Emitters, SubjectPayload, XBus, XEvent, XEventPayload } from './x-bus.types';

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
export class XPriorityBus implements XBus {
  /**
   * Dictionary to store the created event emitters.
   *
   * @internal
   */
  protected emitters: Emitters = {};

  public constructor(protected queue: XPriorityQueue<XEvent> = new XPriorityQueue()) {}

  public pendingEmit!: number;

  public pendingPops: number[] = [];

  /**
   * Emits an event. See {@link XBus.(emit:2)}.
   *
   * @param event - Event to be emitted.
   * @param payload - Event payload.
   * @param metadata - Information of who emits the event.
   */
  emit<Event extends XEvent>(
    event: Event,
    payload?: XEventPayload<Event>,
    metadata: Dictionary = { moduleName: null }
  ): Promise<XEvent> {
    // Payload is defined here as an optional argument (which is wrong), but as this
    // implementation must be used with the type XBus there is no problem
    const value: SubjectPayload<XEventPayload<Event>> = {
      eventPayload: payload,
      metadata
    };
    // logDevtoolsXEvent(event, value);
    return new Promise<XEvent>(resolve => {
      this.queue.push(event, this.getEventPriority(event), {
        replaceable: false,
        resolve,
        ...value
      });

      this.flushQueue();
    });
  }

  protected getEventPriority(event: XEvent): number {
    return eventsPriorities[event] ?? Number.MAX_VALUE;
  }

  protected flushQueue(): void {
    this.pendingPops.forEach(clearTimeout);
    if (this.pendingEmit) {
      clearTimeout(this.pendingEmit);
    }

    this.pendingEmit = setTimeout(() => {
      while (!this.queue.isEmpty()) {
        const popTimeout = setTimeout(async () => {
          const element = this.queue.pop();
          if (element) {
            const { metadata } = element;
            const emitter = this.getOrCreateEmitter(element.key);
            emitter.next({
              eventPayload: metadata.eventPayload as any,
              metadata: metadata.metadata as any
            });
            await (metadata.resolve as AnyFunction)(element.key);
          }

          this.pendingPops = this.pendingPops.filter(pendingPop => pendingPop !== popTimeout);
        });

        this.pendingPops.push(popTimeout);
      }
    });

    this.pendingEmit = 0;
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
export const xPriorityBus: XBus = new XPriorityBus();
// TODO Remove this instantiation and replace with injection where used
