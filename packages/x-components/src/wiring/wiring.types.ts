import { Observable, Subscription } from 'rxjs';
import { Store } from 'vuex';
import { XBus } from '../plugins/x-bus.types';
import { RootStoreStateAndGetters, RootXStoreState } from '../store';
import { QueryOrigin } from '../types/query-origin';
import {
  Dictionary,
  FirstParameter,
  PropsWithType,
  MonadicFunction,
  NiladicFunction
} from '../utils';
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
  /** The id of the component origin. */
  id?: string;
  /** The {@link XModule} name that emitted the event or `null` if it has been emitted from an
   * unknown module. */
  moduleName: XModuleName | null;
  /** The origin for tagging purposes. */
  origin?: QueryOrigin;
  /** The DOM element that triggered the event emission. */
  target?: HTMLElement;
  /** The component instance that triggered the event emission. */
  component?: Vue;
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
 * Type not safe which allows the access to the State, the Getters, the payload and metadata of
 * a {@link XStoreModule}.
 *
 * @public
 */
export type PayloadFactoryData<Payload> = RootStoreStateAndGetters & {
  eventPayload: Payload;
  metadata: WireMetadata;
};

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

/**
 * Wires factory to invoke methods from a given service.
 *
 * @public
 */
export interface WireService<SomeService> {
  /**
   * Creates a wire that will invoke the given service function with the payload of the event it
   * is subscribed to.
   *
   * @param method - The method to invoke.
   * @returns A Wire that expects to receive the function parameter as payload.
   */
  <SomeMethod extends PropsWithType<SomeService, MonadicFunction>>(method: SomeMethod): Wire<
    FirstParameter<SomeService[SomeMethod]>
  >;
  /**
   * Creates a wire that will invoke the given service function with the provided static payload.
   *
   * @param method - The method to invoke.
   * @param payload - The payload to invoke the service with.
   * @returns A Wire that can be used anywhere.
   */
  <SomeMethod extends PropsWithType<SomeService, MonadicFunction>>(
    method: SomeMethod,
    payload: FirstParameter<SomeService[SomeMethod]>
  ): AnyWire;
}

/**
 * Wires factory to invoke methods from a given service.
 *
 * @public
 */
export interface WireServiceWithoutPayload<SomeService> {
  /**
   * Creates a wire that will invoke the given service function with no payload.
   *
   * @param method - The method to invoke.
   * @returns A Wire that can be used anywhere.
   */
  <SomeMethod extends PropsWithType<SomeService, NiladicFunction>>(method: SomeMethod): AnyWire;
}
