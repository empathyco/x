import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import Vue from 'vue';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { Emitters, XBus } from './x.types';

/**
 * Basic {@link XBus} implementation, which is used as default
 */
export class BaseXBus implements XBus {
  /** Dictionary to store the created event emitters */
  protected static emitters: Emitters = {};
  /** The component, so the bus can also emit a normal Vue event */
  protected component?: Vue;

  constructor(component?: Vue) {
    this.component = component;
  }

  public emit<E extends XEvent>(event: E, payload?: XEventPayload<E>): void {
    this.getOrCreateEmitter(event).next(payload);
    this.emitXEventAsVueEvent(event, payload);
  }

  public on<E extends XEvent>(event: E): Observable<XEventPayload<E>> {
    return this.getOrCreateEmitter(event);
  }

  /** Emits the {@link XEvent} as a Vue event in the components ancestors
   *
   * @param event The event to emit
   * @param payload The payload of the event if it has
   */
  protected emitXEventAsVueEvent<E extends XEvent>(event: E, payload?: XEventPayload<E>) {
    let component = this.component;
    while (component !== undefined) {
      component.$emit(event, payload);
      component = component.$parent;
    }
  }

  /**
   * Retrieves an event emitter for a given event
   * @param event The event to retrieve the emitter for
   */
  protected getOrCreateEmitter<E extends XEvent>(event: E): Subject<XEventPayload<E>> {
    // TODO I Don't get why the types are not working here
    return BaseXBus.emitters[event] ?? (BaseXBus.emitters[event] = new Subject<XEventPayload<E>>() as any);
  }
}
