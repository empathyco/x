import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from 'vuex';
import { Dictionary } from '../utils';
import { XEvent, XEventPayload } from './events.types';

/**
 * A Wire is a function that receives an observable, the store, and returns a subscription
 * @param T The observable payload type, or any if it accepts anything.
 */
export type Wire<T> = (observable: Observable<T>, store: Store<any>) => Subscription;

/**
 * Alias for a wire with the type of the event payload
 * @param E The event name
 */
export type WireForEvent<E extends XEvent> = Wire<XEventPayload<E>>;

/**
 * Alias for a wire of any type
 */
export type AnyWire = Wire<any>;

/**
 * The Wiring is a record where each key is an EmpathyX event, and the value is a dictionary of wires
 */
export type Wiring = {
  [E in XEvent]: Dictionary<WireForEvent<E>>;
};

/**
 * Type that removing, modifying or adding wires based on a concrete wiring type.
 * @param T the base wiring type
 */
export type WiringOptions<T extends Partial<Wiring>> = {
  [E in keyof T]?: {
    [W in keyof T[E]]?: E extends XEvent ? WireForEvent<E> | undefined : never;
  };
} | Partial<Wiring>;
