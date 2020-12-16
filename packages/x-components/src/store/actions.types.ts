import { ActionContext } from 'vuex';
import { Dictionary, PropsWithType } from '../utils';
import { MutationsDictionary } from './mutations.types';
import { AnyXStoreModule, ExtractPayload, RootXStoreState } from './store.types';

/**
 * Type safe Vuex {@link https://vuex.vuejs.org/api/#actions | Action} context, with the local
 * types of the module.
 *
 * @param State - The module state dictionary type definition.
 * @param Getters - The module getters dictionary type definition.
 * @param Mutations - The module mutation dictionary type definition.
 * @param Actions - The module actions dictionary type definition.
 * @public
 */
export interface XActionContext<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary<Mutations>,
  Actions extends ActionsDictionary<Actions>
> extends ActionContext<State, RootXStoreState> {
  getters: Getters;
  commit<MutationName extends PropsWithType<Mutations, () => void>>(mutation: MutationName): void;
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
 * Flattens the (probably) chained promises of an action type.
 *
 * @param Action - The action function to extract its type.
 * @public
 */
export type ExtractActionReturn<
  Action extends (payload?: any) => any
> = ReturnType<Action> extends Promise<any> ? ReturnType<Action> : Promise<ReturnType<Action>>;

/**
 * Util type for being used on generic constraints which will only accept an object containing
 * actions.
 *
 * @example Example constraint
 * ```typescript
 *  // This function allows receiving any object who only contains actions;
 *  function sampleFunction\<Actions extends ActionsDictionary\<Actions\>\>(actions: Actions): void;
 * ```
 * @public
 */
export type ActionsDictionary<Actions> = Record<keyof Actions, (payload?: any) => any>;

/**
 * Type-safe actions definition type. An object with this type is what it is needed to define
 * {@link https://vuex.vuejs.org/ | Vuex} actions.
 *
 * @param State - The module state dictionary type definition.
 * @param Getters - The module getters dictionary type definition.
 * @param Mutations - The module mutation dictionary type definition.
 * @param Actions - The module actions dictionary type definition.
 *
 * @public
 */
export type ActionsTree<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary<Mutations>,
  Actions extends ActionsDictionary<Actions>
> = {
  [Key in keyof Actions]: (
    context: XActionContext<State, Getters, Mutations, Actions>,
    payload: ExtractPayload<Actions[Key]>
  ) => ReturnType<Actions[Key]> | Promise<ReturnType<Actions[Key]>>;
};

/**
 * Alias for any actions tree. Use only when you really don't care about the actions type.
 *
 * @public
 */
export type AnyActionsTree = ActionsTree<
  Dictionary,
  Dictionary,
  MutationsDictionary<any>,
  ActionsDictionary<any>
>;

/**
 * Type for implementing actions for a module with a class.
 *
 * @param Module - The module this actions belong to.
 * @public
 */
export type ActionsClass<Module extends AnyXStoreModule> = Partial<Module['actions']>;
