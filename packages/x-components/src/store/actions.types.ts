import { ActionContext } from 'vuex';
import { Dictionary, PropsWithType } from '../utils';
import { MutationsDictionary } from './mutations.types';
import { RootXStoreState } from './store.types';

/**
 * Type safe Vuex {@link ActionContext}, with the local types of the module
 * @param State the module state dictionary type definition
 * @param Getters the module getters dictionary type definition
 * @param Mutations the module mutation dictionary type definition
 * @param Actions the module actions dictionary type definition
 */
export interface XActionContext<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary,
  Actions extends ActionsDictionary
> extends ActionContext<State, RootXStoreState> {
  getters: Getters;
  commit<MutationName extends PropsWithType<Mutations, () => void>>(
    mutation: MutationName
  ): void;
  commit<MutationName extends keyof Mutations>(
    mutation: MutationName,
    payload: ExtractPayload<Mutations[MutationName]>
  ): void;
  dispatch<ActionName extends PropsWithType<Actions, () => any>>(
    action: ActionName
  ): ExtractActionReturn<Actions[ActionName]>;
  dispatch<ActionName extends keyof Actions>(
    action: ActionName,
    payload: ExtractPayload<Actions[ActionName]>
  ): ExtractActionReturn<Actions[ActionName]>;
}

/**
 * Flattens the (probably) chained promises of an action type
 * @param Action the action function to extract its type
 */
export type ExtractActionReturn<
  Action extends (payload?: any) => any
> = ReturnType<Action> extends Promise<any>
  ? ReturnType<Action>
  : Promise<ReturnType<Action>>;

/**
 * Extracts the payload from an action
 * @param Action the action to extract it's payload type from
 */
export type ExtractPayload<Action extends (payload?: any) => any> = Parameters<
  Action
>[0];

/**
 * Intermediate type that must be extended to implement a store module actions definitions. This type will then be used by
 * {@link ActionsTree} to offer a type-safe `dispatch` method.
 */
export type ActionsDictionary = Dictionary<(payload?: any) => any>;

/**
 * Type-safe actions definition type. An object with this type is what it is needed to define {@link Vuex} actions
 * @param State the module state dictionary type definition
 * @param Getters the module getters dictionary type definition
 * @param Mutations the module mutation dictionary type definition
 * @param Actions the module actions dictionary type definition
 */
export type ActionsTree<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary,
  Actions extends ActionsDictionary
> = {
  [Key in keyof Actions]: (
    context: XActionContext<State, Getters, Mutations, Actions>,
    payload: Parameters<Actions[Key]>[0]
  ) => ReturnType<Actions[Key]> | Promise<ReturnType<Actions[Key]>>;
};

/**
 * Alias for any actions tree. Use only when you really don't care about the actions type
 */
export type AnyActionsTree = ActionsTree<
  Dictionary,
  Dictionary,
  MutationsDictionary,
  ActionsDictionary
>;
