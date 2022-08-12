import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata, WirePayload } from '../wiring/wiring.types';
import { Emitter, Emitters, XBus } from './x-bus.types';
import { forEach } from '@empathyco/x-utils';

interface Queues {
  high: QueueEvent<XEvent>[];
  mid: QueueEvent<XEvent>[];
  low: QueueEvent<XEvent>[];
}

interface QueueEvent<SomeEvent extends XEvent> {
  event: SomeEvent;
  payload: WirePayload<XEventPayload<SomeEvent>>;
}

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

  protected queues: Queues = {
    high: [],
    mid: [],
    low: []
  };

  protected pendingResolve: number | null = null;

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
    metadata: WireMetadata = { moduleName: null }
  ): void {
    const value: WirePayload<XEventPayload<Event>> = {
      eventPayload: payload!,
      metadata
    };
    const queueName = this.getEventPriority(event);
    this.queues[queueName] = this.queues[queueName].filter(pending => pending.event !== event);
    this.queues[queueName].push({ event, payload: value });
    if (this.pendingResolve === null) {
      this.pendingResolve = setTimeout(this.flushQueues.bind(this));
    }
  }

  protected getEventPriority<SomeEvent extends XEvent>(event: SomeEvent): keyof Queues {
    if (/(RequestChanged|UrlStateChanged)$/g.test(event)) {
      return 'low';
    }
    if (/Changed$/g.test(event)) {
      return 'mid';
    }
    return 'high';
  }

  protected async flushQueues(): Promise<void> {
    let next: QueueEvent<XEvent> | undefined;
    while (
      (next = this.queues.high.shift() ?? this.queues.mid.shift() ?? this.queues.low.shift())
    ) {
      const { event, payload } = next;
      const emitter = this.getOrCreateEmitter(event);
      emitter.next(payload);
      await Promise.resolve();
    }
    this.pendingResolve = null;
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
  ): Observable<WirePayload<XEventPayload<Event>> | XEventPayload<Event>> {
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
      (this.emitters[event] = new ReplaySubject<WirePayload<XEventPayload<Event>>>(1) as any)
    );
  }
}

/** @internal The bus instance. Will be replaced by injection */
export const bus: XBus = new BaseXBus();
// TODO Remove this instantiation and replace with injection where used
