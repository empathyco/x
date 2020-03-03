import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { Emitters, XBus } from './x-bus.types';

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

  /** Emits an event. See {@link XBus.(emit:2)} */
  public emit<Event extends XEvent>(event: Event, payload?: XEventPayload<Event>): void {
    this.getOrCreateEmitter(event).next(payload);
  }

  /** Retrieves an observable. See {@link XBus.on} */
  public on<Event extends XEvent>(event: Event): Observable<XEventPayload<Event>> {
    return this.getOrCreateEmitter(event);
  }

  /**
   * Retrieves an event emitter for a given event
   *
   * @param event - The event to retrieve the emitter for
   * @returns The emitter for the event passed
   * @internal
   */
  protected getOrCreateEmitter<Event extends XEvent>(event: Event): Subject<XEventPayload<Event>> {
    // TODO I Don't get why the types are not working here
    return (
      this.emitters[event] ?? (this.emitters[event] = new Subject<XEventPayload<Event>>() as any)
    );
  }
}

/** @internal The bus instance. Will be replaced by injection */
export const bus = new BaseXBus(); // TODO Remove this instantiation and replace with injection where used
