import { Observable, Subscription } from 'rxjs';
import { Store } from 'vuex';
import { ExtractActions, ExtractMutations, ExtractPayload, RootXStoreState } from '../store';
import { Dictionary, PropsWithType } from '../utils';
import {
  ExtractGetters,
  ExtractState,
  XModuleName,
  XModulesTree
} from '../x-modules/x-modules.types';
import { XEvent, XEventPayload } from './events.types';

/**
 * A Wire is a function that receives an observable, the store, and returns a subscription.
 *
 * @param PayloadType - The observable payload type, or any if it accepts anything.
 * @public
 */
export type Wire<PayloadType> = (
  observable: Observable<WirePayload<PayloadType>>,
  store: Store<RootXStoreState>
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
  origin?: string;
}

/**
 * The wire payload includes the payload of the event, and a {@link WireMetadata} object to add
 * more information to the event.
 *
 * @typeParam PayloadType - The type of the event's payload
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
 * @typeParam Payload - The payload type of the wire
 * @public
 */
export interface WireParams<Payload> extends WirePayload<Payload> {
  store: Store<RootXStoreState>;
}

/**
 * The type of the object passed as parameter to the payload of the
 * {@link NamespacedWireFactory.(wireCommit:1)} method when this payload is a function.
 * This object allow the access to the State and the Getters of a {@link XStoreModule}.
 *
 * @typeParam ModuleName - The {@link XModuleName} of the module of {@link NamespacedWireFactory}
 *
 * @public
 */
export interface WirePayloadParams<ModuleName extends XModuleName> {
  state: ExtractState<ModuleName>;
  getters: ExtractGetters<ModuleName>;
}

/**
 * Type safe wire factory, that provides methods for creating wires that can only
 * access the Module of the {@link https://vuex.vuejs.org/ | Vuex} Store passed as parameter. It
 * is extended with the namespaced operator wires factory.
 *
 * @param ModuleName - The {@link XStoreModule} to create the wires.
 * @public
 */
export interface NamespacedWireFactory<ModuleName extends XModuleName>
  extends NamespacedOperatorWiresFactory<ModuleName> {
  /**
   * Creates a wire that commits a mutation to the store with an static payload. This wire can
   * be used in every event, as it does not have a payload type associated.
   *
   * @param mutation - The name of the mutation of the module to execute. I.e. `setQuery`.
   * @param payload - A static payload to pass to the mutation which will be committed
   * OR a function that receives a {@link WirePayloadParams} to access the State and the Getters
   * of the module and returns the payload.
   * @returns {@link AnyWire} A wire that commits the mutation with the static payload or the
   * returned value of the payload as a function.
   */
  wireCommit<
    Mutations extends ExtractMutations<XModulesTree[ModuleName]>,
    MutationName extends PropsWithType<Mutations, (payload: any) => void>
  >(
    mutation: MutationName,
    payload:
      | ExtractPayload<Mutations[MutationName]>
      | ((storeModule: WirePayloadParams<ModuleName>) => ExtractPayload<Mutations[MutationName]>)
  ): AnyWire;
  /**
   * Creates a wire that commits a mutation to the store. This wire will commit to the store the
   * payload that it receives in the observable.
   *
   * @param mutation - The name of the mutation of the module to execute. I.e. `setQuery`.
   * @returns {@link Wire} A wire that commits the mutation with the payload that it
   * receives in the observable.
   */
  wireCommit<
    Mutations extends ExtractMutations<XModulesTree[ModuleName]>,
    MutationName extends PropsWithType<Mutations, (payload: any) => void>
  >(
    mutation: MutationName
  ): Wire<ExtractPayload<Mutations[MutationName]>>;
  /**
   * Creates a wire that commits a mutation to the store, but without any payload. This wire can
   * be used in every event, as it does not have a payload type associated.
   *
   * @param mutation - The name of the mutation of the module to execute. I.e. `setQuery`.
   * @returns {@link AnyWire} A wire that commits the mutation without any payload.
   */
  wireCommitWithoutPayload<
    Mutations extends ExtractMutations<XModulesTree[ModuleName]>,
    MutationName extends PropsWithType<Mutations, () => void>
  >(
    mutation: MutationName
  ): AnyWire;
  /**
   * Creates a wire that dispatches an action to the store with an static payload. This wire can
   * be used in every event, as it does not have a payload type associated.
   *
   * @param action - The action name to commit. I.e. `getSuggestions`.
   * @param staticPayload - A static payload to pass to the action which will be dispatched.
   * @returns {@link AnyWire} A wire that dispatches the action with the staticPayload payload.
   */
  wireDispatch<
    Actions extends ExtractActions<XModulesTree[ModuleName]>,
    ActionName extends PropsWithType<Actions, (payload: any) => void>
  >(
    action: ActionName,
    staticPayload: ExtractPayload<Actions[ActionName]>
  ): AnyWire;
  /**
   * Creates a wire that dispatches an action to the store. This wire will pass the payload
   * received in the observable to the action.
   *
   * @param action - The action name to commit. I.e. `getSuggestions`.
   * @typeParam Payload - the type of the payload that this wire will receive
   * @returns {@link Wire} A wire that dispatches the action with the payload that it
   * receives in the observable.
   */
  wireDispatch<
    Actions extends ExtractActions<XModulesTree[ModuleName]>,
    ActionName extends PropsWithType<Actions, (payload: any) => void>
  >(
    action: ActionName
  ): Wire<ExtractPayload<Actions[ActionName]>>;
  /**
   * Creates a wire that dispatches an action to the store, but without any payload. This wire
   * can be used in every event, as it does not have a payload type associated.
   *
   * @param action - The action name to commit. I.e. `getSuggestions`.
   * @returns {@link AnyWire} A wire that dispatches the action without any payload.
   */
  wireDispatchWithoutPayload<
    Actions extends ExtractActions<XModulesTree[ModuleName]>,
    ActionName extends PropsWithType<Actions, () => void>
  >(
    action: ActionName
  ): AnyWire;
}

/**
 * Type safe operator wires factory, that provides methods for creating operator wires that can only
 * access the Module of the {@link https://vuex.vuejs.org/ | Vuex} Store passed as parameter.
 *
 * @param ModuleName - The {@link XStoreModule} to create the operator wires.
 * @internal
 */
interface NamespacedOperatorWiresFactory<ModuleName extends XModuleName> {
  /**
   * Creates a wire that uses the {@link debounce} wire operator to execute the `executorWire`
   * after the time has passed without invoking it. This debounce time is given by the execution
   * of the `timeRetrieving` function.
   *
   * @param executorWire - The wire to debounce.
   * @param timeRetrieving - Function which accesses to the State and the Getters of the namespaced
   * {@link XStoreModule} to retrieve the debounce time from there.
   * @returns {@link AnyWire} A wire that bounces the execution of the `executorWire`.
   */
  wireDebounce(
    executorWire: AnyWire,
    timeRetrieving: NamespacedTimeRetrieving<ModuleName>
  ): AnyWire;
  /**
   * Creates a wire that uses the {@link throttle} wire operator to execute the `executorWire`
   * once every couple of milliseconds. This throttle time is given by the execution of the
   * `timeRetrieving` function.
   *
   * @param executorWire - The wire to throttle.
   * @param timeRetrieving - Function which accesses to the State and the Getters of the namespaced
   * {@link XStoreModule} to retrieve the throttle time from there.
   * @returns {@link AnyWire} A wire that throttles the execution of the `executorWire`.
   */
  wireThrottle(
    executorWire: AnyWire,
    timeRetrieving: NamespacedTimeRetrieving<ModuleName>
  ): AnyWire;
}

/**
 * It is a function that receives the whole store as parameter and retrieve the time from there.
 *
 * @public
 */
export type TimeRetrieving = (storeModule: Store<RootXStoreState>) => number;

/**
 * It is a function that receives the State and the Getters of the namespace {@link XStoreModule}
 * to retrieve the time from there.
 *
 * @public
 */
export type NamespacedTimeRetrieving<ModuleName extends XModuleName> = (
  storeModule: WirePayloadParams<ModuleName>
) => number;
