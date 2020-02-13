import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from 'vuex';
import { ExtractActions, ExtractMutations, ExtractPayload, RootXStoreState } from '../store';
import { DeepPartial, Dictionary, PropsWithType } from '../utils';
import { AnyXModule } from '../x-modules/x-modules.types';
import { XEvent, XEventPayload } from './events.types';

/**
 * A Wire is a function that receives an observable, the store, and returns a subscription
 * @param T The observable payload type, or any if it accepts anything.
 */
export type Wire<T> = (observable: Observable<T>, store: Store<RootXStoreState>) => Subscription;

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
export type WiringOptions<T extends Partial<Wiring>> = DeepPartial<T> | Partial<Wiring>;

/**
 * Type safe wire factory, that provides methods for creating wires that can only
 * access the Module of the {@link Vuex} Store passed as parameter
 * @param Module - The {@link XStoreModule} to create the wires
 */
export interface NamespacedWireFactory<Module extends AnyXModule> {
  wireCommit<
    Mutations extends ExtractMutations<Module>,
    MutationName extends PropsWithType<Mutations, (payload: any) => void>
  >(
    mutation: MutationName,
    staticPayload: ExtractPayload<Mutations[MutationName]>
  ): AnyWire;
  wireCommit<
    Mutations extends ExtractMutations<Module>,
    MutationName extends PropsWithType<Mutations, (payload: any) => void>
  >(
    mutation: MutationName
  ): Wire<ExtractPayload<Mutations[MutationName]>>;
  wireCommitWithoutPayload<
    Mutations extends ExtractMutations<Module>,
    MutationName extends PropsWithType<Mutations, () => void>
  >(
    mutation: MutationName
  ): AnyWire;
  wireDispatch<
    Actions extends ExtractActions<Module>,
    ActionName extends PropsWithType<Actions, (payload: any) => void>
  >(
    action: ActionName,
    staticPayload: ExtractPayload<Actions[ActionName]>
  ): AnyWire;
  wireDispatch<
    Actions extends ExtractActions<Module>,
    ActionName extends PropsWithType<Actions, (payload: any) => void>
  >(
    action: ActionName
  ): Wire<ExtractPayload<Actions[ActionName]>>;
  wireDispatchWithoutPayload<
    Actions extends ExtractActions<Module>,
    ActionName extends PropsWithType<Actions, () => void>
  >(
    action: ActionName
  ): AnyWire;
}
