import { Store } from 'vuex';
import { ActionsTree, AnyActionsTree } from '../store/actions.types';
import { AnyGettersTree, GettersTree } from '../store/getters.types';
import { AnyMutationsTree, MutationsTree } from '../store/mutations.types';
import { AnyStoreEmitters } from '../store/store-emitters.types';
import { AnyXStoreModule, XStoreModule } from '../store/store.types';
import { DeepPartial, Dictionary } from '../utils';
import { WiringOptions } from '../wiring/wiring.types';
import {
  AnyXModule,
  XModuleName,
  XModulesTree
} from '../x-modules/x-modules.types';
import { XBus } from './x-bus.types';

/**
 * { @link XPlugin } installation options
 */
export interface XPluginOptions {
  /** A Vuex store to install the X module. If not passed a new one will be created and injected into every component */
  store?: Store<any>;
  /** Override the default configuration of the {@link XModule | XModules} */
  xModules?: XModulesOptions;
}

/**
 * The XComponentAPI exposes access to the {@link XBus} to the components
 */
export interface XComponentAPI extends XBus {}

/**
 * Options to modify the {@link StoreEmitters}
 * @param StoreEmitters The default store emitters type to modify
 */
export type StoreEmittersOptions<StoreEmitters extends AnyStoreEmitters> =
  | DeepPartial<StoreEmitters>
  | AnyStoreEmitters;

/**
 * Options for overriding the default XModules configuration
 */
export type XModulesOptions = {
  [N in XModuleName]?: XModuleOptions<XModulesTree[N]>;
};

/**
 * Options for overriding a default XModule configuration
 * @param M The module name to modify its default configuration
 */
export interface XModuleOptions<M extends AnyXModule> {
  /** The options to override events that will be emitted when a the getters value or the state of the store changes */
  storeEmitters?: StoreEmittersOptions<M['storeEmitters']>;
  /** The options to override the default store module configuration */
  storeModule?: XStoreModuleOptions<M['storeModule']>;
  /** The options to override the default wiring configuration for the module */
  wiring?: WiringOptions<M['wiring']>;
}

/**
 * Options for overriding a default {@link XStoreModule}
 *
 */
export type XStoreModuleOptions<
  StoreModule extends AnyXStoreModule
> = StoreModule extends XStoreModule<
  infer State,
  infer Getters,
  infer Mutations,
  infer Actions
>
  ? {
      state?: DeepPartial<State> & Dictionary;
      actions?: DeepPartial<ActionsTree<State, Getters, Mutations, Actions>> &
        AnyActionsTree;
      getters?: DeepPartial<GettersTree<State, Getters>> & AnyGettersTree;
      mutations?: DeepPartial<MutationsTree<State, Mutations>> &
        AnyMutationsTree;
    }
  : never;

/**
 * Alias for any store modules options. Use only when you don't care about the module concrete type
 */
export type AnyXStoreModuleOptions = XStoreModuleOptions<AnyXStoreModule>;
