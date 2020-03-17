import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from 'vuex';
import { ExtractActions, ExtractMutations, ExtractPayload, RootXStoreState } from '../store';
import { Dictionary, PropsWithType } from '../utils';
import { AnyXModule, XModuleName } from '../x-modules/x-modules.types';
import { XEvent, XEventPayload } from './events.types';

/**
 * A Wire is a function that receives an observable, the store, and returns a subscription
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
 * be processed with more precision if needed
 *
 * @public
 */
export interface WireMetadata {
  /** The {@link XModule} name that emitted the event or `null` if it has been emitted from an unknown module */
  moduleName: XModuleName | null;
  /** The DOM element that triggered the event emission */
  target?: HTMLElement;
}

/**
 * The wire value includes the payload of the event, and a {@link WireMetadata} object to add more information to the event
 *
 * @typeParam PayloadType - The type of the event's payload
 * @public
 */
export interface WirePayload<PayloadType> {
  /** The payload of the event, which must be of type {@link XEventPayload} */
  eventPayload: PayloadType;
  /** An object containing information about the emission of the event */
  metadata: WireMetadata;
}

/**
 * Alias for a wire with the type of the event payload
 *
 * @param Event - The event name
 * @public
 */
export type WireForEvent<Event extends XEvent> = Wire<XEventPayload<Event>>;

/**
 * Alias for a wire of any type
 *
 * @public
 */
export type AnyWire = Wire<any>;

/**
 * The Wiring is a record where each key is an EmpathyX event, and the value is a dictionary of wires
 *
 * @public
 */
export type Wiring = {
  [E in XEvent]: Dictionary<WireForEvent<E>>;
};

/**
 * Groups the payload, metadata, and the store into an object to avoid having multiple parameters
 *
 * @typeParam Payload - The payload type of the wire
 * @public
 */
export interface WireParams<Payload> extends WirePayload<Payload> {
  store: Store<RootXStoreState>;
}

/**
 * Type safe wire factory, that provides methods for creating wires that can only
 * access the Module of the {@link https://vuex.vuejs.org/ | Vuex} Store passed as parameter
 *
 * @param Module - The {@link XStoreModule} to create the wires
 * @public
 */
export interface NamespacedWireFactory<Module extends AnyXModule> {
  /**
   * Creates a wire that commits a mutation to the store with an static payload. This wire can be used in every event, as it does not have a payload type
   * associated.
   *
   * @param mutation - The name of the mutation of the module to execute. i.e. `setQuery`
   * @param staticPayload - A static payload to pass to the mutation which will be committed
   * @returns [AnyWire] A wire that commits the mutation with the staticPayload payload
   */
  wireCommit<
    Mutations extends ExtractMutations<Module>,
    MutationName extends PropsWithType<Mutations, (payload: any) => void>
  >(
    mutation: MutationName,
    staticPayload: ExtractPayload<Mutations[MutationName]>
  ): AnyWire;
  /**
   * Creates a wire that commits a mutation to the store. This wire will commit to the store the payload that it receives in the observable.
   *
   * @param mutation - The name of the mutation of the module to execute. i.e. `setQuery`
   * @returns [Wire<Payload>] A wire that commits the mutation with the payload that it receives in the observable
   */
  wireCommit<
    Mutations extends ExtractMutations<Module>,
    MutationName extends PropsWithType<Mutations, (payload: any) => void>
  >(
    mutation: MutationName
  ): Wire<ExtractPayload<Mutations[MutationName]>>;
  /**
   * Creates a wire that commits a mutation to the store, but without any payload. This wire can be used in every event, as it does not have
   * a payload type associated.
   *
   * @param mutation - The name of the mutation of the module to execute. i.e. `setQuery`
   * @returns [AnyWire] A wire that commits the mutation without any payload
   */
  wireCommitWithoutPayload<
    Mutations extends ExtractMutations<Module>,
    MutationName extends PropsWithType<Mutations, () => void>
  >(
    mutation: MutationName
  ): AnyWire;
  /**
   * Creates a wire that dispatches an action to the store with an static payload. This wire can be used in every event, as it does not have a payload type
   * associated.
   *
   * @param action - The action name to commit. i.e. `getSuggestions`
   * @param staticPayload - A static payload to pass to the action which will be dispatched
   * @returns [AnyWire] A wire that dispatches the action with the staticPayload payload
   */
  wireDispatch<
    Actions extends ExtractActions<Module>,
    ActionName extends PropsWithType<Actions, (payload: any) => void>
  >(
    action: ActionName,
    staticPayload: ExtractPayload<Actions[ActionName]>
  ): AnyWire;
  /**
   * Creates a wire that dispatches an action to the store. This wire will pass the payload received in the observable to the action.
   *
   * @param action - The action name to commit. i.e. `getSuggestions`
   * @typeParam Payload - the type of the payload that this wire will receive
   * @returns [Wire<Payload>] A wire that dispatches the action with the payload that it receives in the observable
   */
  wireDispatch<
    Actions extends ExtractActions<Module>,
    ActionName extends PropsWithType<Actions, (payload: any) => void>
  >(
    action: ActionName
  ): Wire<ExtractPayload<Actions[ActionName]>>;
  /**
   * Creates a wire that dispatches an action to the store, but without any payload. This wire can be used in every event, as it does not
   * have a payload type associated.
   *
   * @param action - The action name to commit. i.e. `getSuggestions`
   * @returns [AnyWire] A wire that dispatches the action without any payload
   */
  wireDispatchWithoutPayload<
    Actions extends ExtractActions<Module>,
    ActionName extends PropsWithType<Actions, () => void>
  >(
    action: ActionName
  ): AnyWire;
}
