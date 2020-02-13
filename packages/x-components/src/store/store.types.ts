import { AnyXModule, XModule, XModulesTree } from '../x-modules/x-modules.types';
import { Dictionary } from '../utils';
import { ActionsDictionary, ActionsTree } from './actions.types';
import { GettersTree } from './getters.types';
import { MutationsDictionary, MutationsTree } from './mutations.types';

/**
 * Base X store state type. All {@link XStoreModule} are nested under the `x` module for safe scoping.
 */
export interface RootXStoreState {
  x: {
    [Module in keyof XModulesTree]: XModulesTree[Module]['storeModule'] extends XStoreModule<
      infer State,
      any,
      any,
      any
    >
      ? State
      : never;
  };
}

/**
 * Type safe {@link Vuex} store module
 *
 * @example ```typescript
 * interface SearchBoxState {
 *  query: string;
 *}
 *
 * interface SearchBoxGetters {
 *  safeQuery: string;
 *}
 *
 * interface SearchBoxMutations extends MutationsDictionary {
 *  setQuery(newQuery: string): void;
 *}
 *
 * interface SearchBoxActions extends ActionsDictionary {
 *  someAsyncExampleFunction(): Promise<string>;
 *  someExampleFunction(doThings: boolean): number;
 * }
 *
 * type SearchBoxXStoreModule = XStoreModule<SearchBoxState, SearchBoxGetters, SearchBoxMutations, SearchBoxActions>;
 *
 * const searchBoxXStoreModule: SearchBoxXStoreModule = {
 *  state: () => ({ query: '' }),
 *  getters: {
 *    safeQuery(state) {
 *      // Your implementation code
 *    }
 *  },
 *  mutations: {
 *    setQuery(state, newQuery) {
 *      // Your implementation code
 *    }
 *  },
 *  actions: {
 *   someAsyncExampleFunction() {
 *     // Your implementation code
 *   },
 *   someExampleFunction(context, doThings) {
 *     // Your implementation code
 *   }
 * }
 *};
 * ```
 */
export interface XStoreModule<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary,
  Actions extends ActionsDictionary
> {
  actions: ActionsTree<State, Getters, Mutations, Actions>;
  getters: GettersTree<State, Getters>;
  mutations: MutationsTree<State, Mutations>;
  state: () => State;
}

/**
 * Alias for an {@link XStoreModule} with any type. Use only when the state, getters, mutations and actions are not relevant.
 */
export type AnyXStoreModule = XStoreModule<any, any, any, any>;

/**
 * Extracts the mutations type from a XStoreModule
 * @param Module - The {@link XStoreModule} to extract its {@link MutationsDictionary}
 */
export type ExtractMutations<Module extends AnyXModule> = Module extends XModule<
  XStoreModule<any, any, infer Mutations, any>
>
  ? Mutations
  : never;

/**
 * Extracts the actions type from a XStoreModule
 * @param Module - The {@link XStoreModule} to extract its {@link ActionsDictionary}
 */
export type ExtractActions<Module extends AnyXModule> = Module extends XModule<
  XStoreModule<any, any, any, infer Actions>
>
  ? Actions
  : never;

/**
 * Extracts the payload from any function with a single parameter
 * @param Function - A function type with one parameter and any return type
 */
export type ExtractPayload<Function extends (payload?: any) => any> = Parameters<Function>[0];
