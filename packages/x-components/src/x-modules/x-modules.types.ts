import { StoreEmitters } from '../store/store-emitters.types';
import { AnyXStoreModule, XStoreModule } from '../store/store.types';
import { Wiring } from '../wiring/wiring.types';
import { SearchBoxXModule } from './search-box/x-module';
import { TermSuggestionsXModule } from './term-suggestions/x-module';

/**
 * Gives each {@link XModule} a name, that can be used to retrieve then its value.
 */
export interface XModulesTree {
  searchBox: SearchBoxXModule;
  termSuggestions: TermSuggestionsXModule;
}

/**
 * Names of all of the {@link XModule | XModules} available
 */
export type XModuleName = keyof XModulesTree;

/**
 * A group of a wiring configuration, a store module, and side effects
 * @param StoreModule The store module state type
 */
export interface XModule<StoreModule extends AnyXStoreModule> {
  /** A unique name that identifies this XModule */
  name: XModuleName;
  /** Watchers for the store module that will emit an XEvent when changed */
  storeEmitters: StoreEmitters<StoreModule>;
  /** The Vuex Store module associated to this module */
  storeModule: StoreModule;
  /** The wiring associated to this module. It must only access to the store module of this XModule */
  wiring: Partial<Wiring>;
}

/**
 * Alias for any XModule. Use with caution
 */
export type AnyXModule = XModule<AnyXStoreModule>;

/**
 * Util type for extracting the state type of a module
 *
 * @param Module - the module name to extract its state type
 */
export type ExtractState<Module extends keyof XModulesTree> = XModulesTree[Module] extends XModule<
  XStoreModule<infer State, any, any, any>
>
  ? State
  : never;

/**
 * Util type for extracting the getter type of a module
 *
 * @param Module - the module name to extract its getters type
 */
export type ExtractGetters<
  Module extends keyof XModulesTree
> = XModulesTree[Module] extends XModule<XStoreModule<any, infer Getters, any, any>>
  ? Getters
  : never;
