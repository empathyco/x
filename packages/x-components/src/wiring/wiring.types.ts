import type { Dictionary } from '@empathyco/x-utils'
import type { Observable, Subscription } from 'rxjs'
import type { Component } from 'vue'
import type { Store } from 'vuex'
import type { RootStoreStateAndGetters, RootXStoreState } from '../store/store.types'
import type { FeatureLocation, QueryFeature, ResultFeature } from '../types/origin'
import type { FirstParameter, MaybeArray, MonadicFunction, NiladicFunction } from '../utils/types'
import type { Priority, SubjectPayload, XPriorityBus } from '../x-bus'
import type { XModuleName } from '../x-modules/x-modules.types'
import type { XEvent, XEventPayload, XEventsTypes } from './events.types'

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
  on: XPriorityBus<XEventsTypes, WireMetadata>['on'],
) => Subscription

/**
 * The wires metadata includes more information about the emitted event, so then these events can
 * be processed with more precision if needed.
 *
 * @public
 */
export interface WireMetadata {
  /** The {@link QueryFeature} that originated the event. */
  feature?: QueryFeature | ResultFeature
  /** The id of the component origin. */
  id?: string
  /** The {@link FeatureLocation} from where the event has been emitted. */
  location?: FeatureLocation
  /**
   * The {@link XModule} name that emitted the event or `null` if it has been emitted from an
   * unknown module.
   */
  moduleName: XModuleName | null
  /** The old value of a watched selector triggering an emitter.  */
  oldValue?: unknown
  /** The DOM element that triggered the event emission. */
  target?: HTMLElement
  /** The component instance that triggered the event emission. */
  component?: Component
  /** The event priority to use when sorting the bus queue for event batching. */
  priority?: Priority
  /**
   * The event replaces an existing entry of the same event in the bus, placing this new one
   * based on its priority.
   */
  replaceable?: boolean
  /**
   * The event can be ignored if it is received in the wiring of the modules in the array.
   */
  ignoreInModules?: XModuleName[]
  [key: string]: unknown
}

/**
 * Wire metadata specific for display wires.
 *
 * @public
 */
export interface DisplayWireMetadata extends WireMetadata {
  /** The query that originated the display elements appearing. */
  displayOriginalQuery: string
}

/**
 * The wire payload includes the payload of the event, and a {@link WireMetadata} object to add
 * more information to the event.
 *
 * @param PayloadType - The type of the event's payload.
 *
 * @public
 */
export interface WirePayload<PayloadType> extends SubjectPayload<PayloadType, WireMetadata> {}

/**
 * Type not safe which allows the access to the State, the Getters, the payload and metadata of
 * a {@link XStoreModule}.
 *
 * @public
 */
export type PayloadFactoryData<Payload> = RootStoreStateAndGetters & {
  eventPayload: Payload
  metadata: WireMetadata
}

/**
 * Alias for a wire with the type of the event payload.
 *
 * @param Event - The event name.
 *
 * @public
 */
export type WireForEvent<Event extends XEvent> = Wire<XEventPayload<Event>>

/**
 * Alias for a wire of any type.
 *
 * @public
 */
export type AnyWire = Wire<any>

/**
 * The Wiring is a record where each key is an EmpathyX event, and the value is a dictionary of
 * wires.
 *
 * @public
 */
export type Wiring = {
  [Event in XEvent]: Dictionary<WireForEvent<Event>>
}

/**
 * Groups the payload, metadata, and the store into an object to avoid having multiple parameters.
 *
 * @param Payload - The payload type of the wire.
 *
 * @public
 */
export interface WireParams<Payload> extends WirePayload<Payload> {
  store: Store<RootXStoreState>
}

/**
 * Function type which receives the whole store as parameter and retrieve the time from there.
 *
 * @public
 */
export type TimeSelector = (storeModule: Store<RootXStoreState>) => number

/**
 * Options for wire operators that delay subscribers.
 *
 * @public
 */
export interface TimedWireOperatorOptions {
  /** Events that will prevent the next planned execution of the wire to be executed. */
  cancelOn?: MaybeArray<XEvent>
  /** Events that will make the next planned execution happen immediately. */
  forceOn?: MaybeArray<XEvent>
}

/**
 * Wires factory to invoke methods from a given service.
 *
 * @public
 */
export interface WireService<SomeService extends Record<string, MonadicFunction>> {
  /**
   * Creates a wire that will invoke the given service function with the payload of the event it
   * is subscribed to.
   *
   * @param method - The method to invoke.
   * @returns A Wire that expects to receive the function parameter as payload.
   */
  <SomeMethod extends keyof SomeService>(
    method: SomeMethod,
  ): Wire<FirstParameter<SomeService[SomeMethod]>>
  /**
   * Creates a wire that will invoke the given service function with the provided static payload.
   *
   * @param method - The method to invoke.
   * @param payload - The payload to invoke the service with.
   * @returns A Wire that can be used anywhere.
   */
  <SomeMethod extends keyof SomeService>(
    method: SomeMethod,
    payload: FirstParameter<SomeService[SomeMethod]>,
  ): AnyWire
}

/**
 * Wires factory to invoke methods from a given service.
 *
 * @public
 */
export interface WireServiceWithoutPayload<SomeService extends Record<string, NiladicFunction>> {
  /**
   * Creates a wire that will invoke the given service function with no payload.
   *
   * @param method - The method to invoke.
   * @returns A Wire that can be used anywhere.
   */
  <SomeMethod extends keyof SomeService>(method: SomeMethod): AnyWire
}
