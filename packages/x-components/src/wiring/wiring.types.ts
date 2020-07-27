import { Observable, Subscription } from 'rxjs';
import { Store } from 'vuex';
import { XBus } from '../plugins/x-bus.types';
import { RootXStoreState } from '../store';
import { QueryOrigin } from '../types/query-origin';
import { Dictionary } from '../utils';
import { XModuleName } from '../x-modules/x-modules.types';
import { XEvent, XEventPayload } from './events.types';

/**
 * A Wire is a function that receives an observable, the store and the on function of the bus it
 * will run in and returns a subscription.
 *
 * @param PayloadType - The observable payload type, or any if it accepts anything.
 *
 * @public
 */
export type Wire<PayloadType> = (
  observable: Observable<WirePayload<PayloadType>>,
  store: Store<RootXStoreState>,
  on: XBus['on']
) => Subscription;

/**
 * The wires metadata includes more information about the emitted event, so then these events can
 * be processed with more precision if needed.
 *
 * @public
 */
export interface WireMetadata {
  /** The {@link XModule} name that emitted the event or `null` if it has been emitted from an
   * unknown module. */
  moduleName: XModuleName | null;
  /** The DOM element that triggered the event emission. */
  target?: HTMLElement;
  /** The origin for tagging purposes. */
  origin?: QueryOrigin;
}

/**
 * The wire payload includes the payload of the event, and a {@link WireMetadata} object to add
 * more information to the event.
 *
 * @param PayloadType - The type of the event's payload.
 *
 * @public
 */
export interface WirePayload<PayloadType> {
  /** The payload of the event, which must be of type {@link XEventPayload}. */
  eventPayload: PayloadType;
  /** An object containing information about the emission of the event. */
  metadata: WireMetadata;
}

/**
 * Alias for a wire with the type of the event payload.
 *
 * @param Event - The event name.
 *
 * @public
 */
export type WireForEvent<Event extends XEvent> = Wire<XEventPayload<Event>>;

/**
 * Alias for a wire of any type.
 *
 * @public
 */
export type AnyWire = Wire<any>;

/**
 * The Wiring is a record where each key is an EmpathyX event, and the value is a dictionary of
 * wires.
 *
 * @public
 */
export type Wiring = {
  [E in XEvent]: Dictionary<WireForEvent<E>>;
};

/**
 * Groups the payload, metadata, and the store into an object to avoid having multiple parameters.
 *
 * @param Payload - The payload type of the wire.
 *
 * @public
 */
export interface WireParams<Payload> extends WirePayload<Payload> {
  store: Store<RootXStoreState>;
}

/**
 * Function type which receives the whole store as parameter and retrieve the time from there.
 *
 * @public
 */
export type TimeRetrieving = (storeModule: Store<RootXStoreState>) => number;
