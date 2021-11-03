import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata, WirePayload } from '../wiring/wiring.types';
import { logDevtoolsXEvent } from './devtools/timeline.devtools';
import { Emitter, Emitters, XBus } from './x-bus.types';

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
    // Payload is defined here as an optional argument (which is wrong), but as this
    // implementation must be used with the type XBus there is no problem
    const value: WirePayload<XEventPayload<Event>> = {
      eventPayload: payload as any,
      metadata
    };
    logDevtoolsXEvent(event, value);
    const emitter = this.getOrCreateEmitter(event);
    emitter.next(value);
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

/** @internal The bus instance. Will be replaced by injection. */
export const bus: XBus = new BaseXBus();
// TODO Remove this instantiation and replace with injection where used
