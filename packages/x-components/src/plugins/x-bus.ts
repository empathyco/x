import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata, WirePayload } from '../wiring/wiring.types';
import { Emitter, Emitters, XBus } from './x-bus.types';

/**
 * Default {@link XBus} implementation
 * @public
 */
export class BaseXBus implements XBus {
  /**
   * Dictionary to store the created event emitters
   *
   * @internal
   */
  protected emitters: Emitters = {};

  /** Emits an event. See {@link XBus.(emit:2)}
   *
   * @public
   */
  emit<Event extends XEvent>(
    event: Event,
    payload?: XEventPayload<Event>,
    metadata: WireMetadata = { moduleName: null }
  ): void {
    // Payload is defined here as an optional argument (which is wrong), but as this implementation must be used with the type XBus there is no problem
    const value: WirePayload<XEventPayload<Event>> = {
      eventPayload: payload as any,
      metadata
    };
    const emitter = this.getOrCreateEmitter(event);
    emitter.next(value);
  }

  /** Retrieves an observable. See {@link XBus.on}
   *
   * @public
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
   * Retrieves an event emitter for a given event
   *
   * @param event - The event to retrieve the emitter for
   * @returns The emitter for the event passed
   * @internal
   */
  protected getOrCreateEmitter<Event extends XEvent>(event: Event): Emitter<Event> {
    // TODO I Don't get why the types are not working here
    return (
      this.emitters[event] ??
      (this.emitters[event] = new Subject<WirePayload<XEventPayload<Event>>>() as any)
    );
  }
}

/** @internal The bus instance. Will be replaced by injection */
export const bus: XBus = new BaseXBus(); // TODO Remove this instantiation and replace with injection where used
