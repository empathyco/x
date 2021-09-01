import { Store } from 'vuex';
import { WireMetadata } from '../wiring/wiring.types';
import {
  AnyXModule,
  ExtractGetters,
  ExtractState,
  XModule,
  XModuleName,
  XModulesTree
} from '../x-modules/x-modules.types';
import { ActionsDictionary, ActionsTree } from './actions.types';
import { GettersTree } from './getters.types';
import { MutationsDictionary, MutationsTree } from './mutations.types';

/**
 * Base X store state type. All {@link XStoreModule} are nested under the `x` module for safe
 * scoping.
 *
 * @public
 */
export interface RootXStoreState {
  x: {
    [Module in XModuleName]: ExtractState<Module>;
  };
}

/**
 * State and Getters Store type for {@link RootXStoreState}.
 *
 * @public
 */
export type RootStoreStateAndGetters = Pick<Store<RootXStoreState>, 'state' | 'getters'>;

/**
 * State and Getters Store type for {@link RootXStoreState} and payload and metadata types.
 *
 * @public
 */
export type WiringData<Payload> = RootStoreStateAndGetters & {
  payload: Payload;
  metadata: WireMetadata;
};

/**
 * Type safe which allows the access to the State, the Getters,the payload and metadata of
 * a {@link XStoreModule}.
 *
 * @public
 */
export type NamespacedWiringData<ModuleName extends XModuleName> =
  StoreModuleStateAndGetters<ModuleName> & {
    payload: ExtractPayload<ModuleName>;
    metadata: WireMetadata;
  };

/**
 * Type safe which allows the access to the State and the Getters of a {@link XStoreModule}.
 *
 * @param ModuleName - The {@link XModuleName} of the module to get its state and getters.
 *
 * @public
 */
export type StoreModuleStateAndGetters<ModuleName extends XModuleName> = {
  state: ExtractState<ModuleName>;
  getters: ExtractGetters<ModuleName>;
};

/**
 * Type safe {@link https://vuex.vuejs.org/ | Vuex} store module.
 *
 * @example
 * How to create a type safe store module:
 * ```typescript
 * interface SearchBoxState {
 *  query: string;
 *}
 *
 * interface SearchBoxGetters {
 *  safeQuery: string;
 *}
 *
 * interface SearchBoxMutations {
 *  setQuery(newQuery: string): void;
 *}
 *
 * interface SearchBoxActions {
 *  someAsyncExampleFunction(): Promise<string>;
 *  someExampleFunction(doThings: boolean): number;
 * }
 *
 * type SearchBoxXStoreModule = XStoreModule<SearchBoxState, SearchBoxGetters, SearchBoxMutations,
 *   SearchBoxActions>;
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
 *
 * @public
 */
export interface XStoreModule<
  State extends Record<keyof State, any>,
  Getters extends Record<keyof Getters, any>,
  Mutations extends MutationsDictionary<Mutations>,
  Actions extends ActionsDictionary<Actions>
> {
  actions: ActionsTree<State, Getters, Mutations, Actions>;
  getters: GettersTree<State, Getters>;
  mutations: MutationsTree<State, Mutations>;
  state: () => State;
}

/**
 * Alias for an {@link XStoreModule} with any type. Use only when the state, getters, mutations and
 * actions are not relevant.
 *
 * @public
 */
export type AnyXStoreModule = XStoreModule<any, any, any, any>;

/**
 * Extracts the mutations type from a XStoreModule.
 *
 * @param Module - The {@link XStoreModule} to extract its {@link MutationsDictionary}.
 * @public
 */
export type ExtractMutations<Module extends AnyXModule> = Module extends XModule<
  XStoreModule<any, any, infer Mutations, any>
>
  ? Mutations
  : never;

/**
 * Extracts the actions type from a XStoreModule.
 *
 * @param Module - The {@link XStoreModule} to extract its {@link ActionsDictionary}.
 * @public
 */
export type ExtractActions<Module extends AnyXModule> = Module extends XModule<
  XStoreModule<any, any, any, infer Actions>
>
  ? Actions
  : never;

/**
 * Extracts the payload from any function with a single parameter.
 *
 * @param SomeFunction - A function type with one parameter and any return type.
 * @public
 */
export type ExtractPayload<SomeFunction> = SomeFunction extends (payload?: any) => any
  ? Parameters<SomeFunction>[0]
  : never;

/**
 * Returns the mutation names for a given module. They are the namespaced mutations.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 * @public
 */
export type MutationNamesFor<ModuleName extends XModuleName> = keyof ExtractMutations<
  XModulesTree[ModuleName]
>;

/**
 * Returns the payload for a mutation given the module name and the mutation name.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 * @param MutationName - The namespaced mutation name to extract the payload.
 * @public
 */
export type ExtractMutationPayload<
  ModuleName extends XModuleName,
  MutationName extends MutationNamesFor<ModuleName>
> = ExtractPayload<ExtractMutations<XModulesTree[ModuleName]>[MutationName]>;

/**
 * Returns the action names for a given module. They are the namespaced actions.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 * @public
 */
export type ActionNamesFor<ModuleName extends XModuleName> = keyof ExtractActions<
  XModulesTree[ModuleName]
>;

/**
 * Returns the payload for an action given the module name and the action name.
 *
 * @param ModuleName - The {@link XModuleName | module name}.
 * @param ActionName - The namespaced action name to extract the payload.
 * @public
 */
export type ExtractActionPayload<
  ModuleName extends XModuleName,
  ActionName extends ActionNamesFor<ModuleName>
> = ExtractPayload<ExtractActions<XModulesTree[ModuleName]>[ActionName]>;
