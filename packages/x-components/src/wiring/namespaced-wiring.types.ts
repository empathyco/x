import {
  ActionNamesFor,
  ExtractActionPayload,
  ExtractActions,
  ExtractMutationPayload,
  ExtractMutations,
  ExtractPayload,
  MutationNamesFor,
  StoreModuleStateAndGetters
} from '../store/store.types';
import { PropsWithType } from '../utils/types';
import { XModuleName, XModulesTree } from '../x-modules/x-modules.types';
import { XEvent } from './events.types';
import { AnyWire, Wire, WireMetadata } from './wiring.types';

/**
 * Function type which receives the State and the Getters of the namespace {@link XStoreModule}
 * to retrieve the time from there.
 *
 * @param ModuleName - The {@link XModuleName} of the module to create a
 * {@link StoreModuleStateAndGetters}.
 *
 * @public
 */
export type NamespacedTimeRetrieving<ModuleName extends XModuleName> = (
  storeModule: StoreModuleStateAndGetters<ModuleName>
) => number;

/**
 * Function type which receives the wire to modify and the {@link NamespacedTimeRetrieving} to
 * retrieve the time from the {@link XStoreModule}.
 *
 * @param ModuleName - The {@link XModuleName} of the module to create a namespaced
 * {@link NamespacedTimeRetrieving}.
 * @param Wire - The wire which will be piped with a timing operator.
 * @param timeRetrieving - Function that receives the State and the Getters of the namespace
 * {@link XStoreModule} to retrieve the time from there.
 * @param raceEvent - The event or events that would prevent the wire execution if at least one
 * of them executes first.
 *
 * @public
 */
export type NamespacedTimeWireOperator<ModuleName extends XModuleName, Wire> = (
  wire: Wire,
  timeRetrieving: NamespacedTimeRetrieving<ModuleName>,
  raceEvent?: XEvent | XEvent[]
) => Wire;

/**
 * Namespaced payload to commit a mutation. Either a function that receives the
 * {@link StoreModuleStateAndGetters | module state and getters} and returns the payload for
 * the mutation, or a static action payload.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 * @param MutationName - The namespaced mutation name to extract the payload.
 *
 * @public
 */
export type NamespacedWireCommitPayload<
  ModuleName extends XModuleName,
  MutationName extends MutationNamesFor<ModuleName>
> =
  | ExtractMutationPayload<ModuleName, MutationName>
  | ((
      wiringData: NamespacedWiringData<ModuleName>
    ) => ExtractMutationPayload<ModuleName, MutationName>);

/**
 * Namespaced type for the {@link (wireCommit:1)} which creates a wire with its payload
 * associated. Possible ways for creating a wire that commits a mutation.
 * If a payload is passed, then the observable payload can be ignored, so the wire is
 * applicable to any event.
 * If no payload is passed, then the wire is only applicable to events with the same payload
 * type than the mutation.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 *
 * @public
 */
export interface NamespacedWireCommit<ModuleName extends XModuleName> {
  <MutationName extends MutationNamesFor<ModuleName>>(mutation: MutationName): Wire<
    ExtractMutationPayload<ModuleName, MutationName>
  >;
  <MutationName extends MutationNamesFor<ModuleName>>(
    mutation: MutationName,
    payload: NamespacedWireCommitPayload<ModuleName, MutationName>
  ): AnyWire;
}

/**
 * Namespaced type for the {@link (wireCommitWithoutPayload:1)} which creates a wire without
 * payload associated.
 *
 * @param MutationName - The namespaced mutation name to extract the payload.
 *
 * @public
 */
export type NamespacedWireCommitWithoutPayload<ModuleName extends XModuleName> = <
  MutationName extends PropsWithType<ExtractMutations<XModulesTree[ModuleName]>, () => any>
>(
  mutation: MutationName
) => AnyWire;

/**
 * Namespaced payload to dispatch an action. Either a function that receives the
 * {@link StoreModuleStateAndGetters | module state and getters} and returns the payload for
 * the action, or a static action payload.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 * @param ActionName - The namespaced action name to extract the payload.
 *
 * @public
 */
export type NamespacedWireDispatchPayload<
  ModuleName extends XModuleName,
  ActionName extends ActionNamesFor<ModuleName>
> =
  | ExtractActionPayload<ModuleName, ActionName>
  | ((
      wiringData: NamespacedWiringData<ModuleName>
    ) => ExtractActionPayload<ModuleName, ActionName>);

/**
 * Namespaced type for the {@link (wireDispatch:1)} which creates a wire with its payload
 * associated. Possible ways for creating a wire that dispatches an action.
 * If a payload is passed, then the observable payload can be ignored, so the wire is
 * applicable to any event.
 * If no payload is passed, then the wire is only applicable to events with the same payload
 * type than the action.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 *
 * @public
 */
export interface NamespacedWireDispatch<ModuleName extends XModuleName> {
  <ActionName extends ActionNamesFor<ModuleName>>(action: ActionName): Wire<
    ExtractActionPayload<ModuleName, ActionName>
  >;
  <ActionName extends ActionNamesFor<ModuleName>>(
    action: ActionName,
    payload: NamespacedWireDispatchPayload<ModuleName, ActionName>
  ): AnyWire;
}

/**
 * Namespaced type for the {@link (wireDispatchWithoutPayload:1)} which creates a wire without
 * payload associated.
 *
 * @param ActionName - The namespaced action name to extract the payload.
 *
 * @public
 */
export type NamespacedWireDispatchWithoutPayload<ModuleName extends XModuleName> = <
  ActionName extends PropsWithType<ExtractActions<XModulesTree[ModuleName]>, () => any>
>(
  action: ActionName
) => AnyWire;

/**
 * Namespaced type safe which allows the access to the State, the Getters, the payload and metadata
 * of a {@link XStoreModule}.
 *
 * @public
 */
export type NamespacedWiringData<ModuleName extends XModuleName> =
  StoreModuleStateAndGetters<ModuleName> & {
    eventPayload: ExtractPayload<ModuleName>;
    metadata: WireMetadata;
  };
