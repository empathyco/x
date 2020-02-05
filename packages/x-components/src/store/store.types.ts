import { XModulesTree } from '../x-modules/x-modules.types';
import { Dictionary } from '../utils';
import { ActionsDictionary, ActionsTree } from './actions.types';
import { GettersTree } from './getters.types';
import { MutationsDictionary, MutationsTree } from './mutations.types';

/**
 * Dictionary where each key is the name of the module, and the value is the corresponding {@link XStoreModule}
 */
export type XStoreTree = {
  [Module in keyof XModulesTree]: XModulesTree[Module]['storeModule'];
};

/**
 * Base X store state type. All {@link XStoreModule} are nested under the `x` module for safe scoping.
 */
export interface RootXStoreState {
  x: {
    [Module in keyof XStoreTree]: XStoreTree[Module] extends XStoreModule<
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
