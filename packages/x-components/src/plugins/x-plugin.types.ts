import { SearchAdapter } from '@empathy/search-adapter';
import { Store } from 'vuex';
import { CurrencyOptions, Messages } from '../i18n';
import { ActionsTree, AnyActionsTree } from '../store/actions.types';
import { AnyGettersTree, GettersTree } from '../store/getters.types';
import { AnyMutationsTree, MutationsTree } from '../store/mutations.types';
import { StoreEmitters } from '../store/store-emitters.types';
import { AnyXStoreModule, XStoreModule } from '../store/store.types';
import { DeepPartial, Dictionary, PropsWithType } from '../utils';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';
import { WireMetadata, Wiring } from '../wiring/wiring.types';
import { AnyXModule, XModuleName, XModulesTree } from '../x-modules/x-modules.types';
import { XBus } from './x-bus.types';

/**
 * {@link XPlugin} installation options
 *
 * @public
 */
export interface XPluginOptions {
  /** A Vuex store to install the X module. If not passed a new one will be created and injected into every component */
  store?: Store<any>;
  /** The global {@link XConfig} accessible in any {@link XComponentAPI | XComponent} */
  config?: XConfig;
  /** Override the default configuration of the {@link XModule | XModules} */
  xModules?: XModulesOptions;
}

/**
 * The global configuration accessible from every component
 *
 * @public
 */
export interface XConfig {
  /** {@link @empathy/search-adapter#SearchAdapter | SearchAdapter} is the middleware between the components and our API where data can be mapped to client needs */
  adapter: SearchAdapter;
  /** Consent to send the user data (userId and sessionId) to our API */
  consent: boolean;
  /** The {@link CurrencyOptions} to format currency values */
  currencyOptions: CurrencyOptions;
  /** HTML dir attribute. Possible values are: ltr(left to right) or rtl(right to left) */
  documentDirection: DocumentDirection;
  /** The {@link Messages} to display in the visual components (i.e. searchBox placeholder */
  messages: Messages;
}

/**
 * The HTML document direction orientation. Possible values: ltr (left to right) or rtl (right to left)
 *
 * @public
 */
export type DocumentDirection = 'ltr' | 'rtl';

/**
 * The XComponentAPI exposes access to the {@link XBus} and {@link XConfig} to the components
 *
 * @public
 */
export interface XComponentAPI extends Pick<XBus, 'on'> {
  /** {@inheritDoc XConfig} */
  config: XConfig;
  /** {@inheritDoc XBus.emit} */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /** {@inheritDoc XBus.emit} */
  emit<Event extends XEvent>(
    event: Event,
    payload: XEventPayload<Event>,
    metadata?: Omit<WireMetadata, 'moduleName'>
  ): void;
}

/**
 * Options for overriding the default XModules configuration
 *
 * @public
 */
export type XModulesOptions = {
  [N in XModuleName]?: XModuleOptions<XModulesTree[N]>;
};

/**
 * Options for overriding a default XModule configuration
 *
 * @typeParam Module - The module name to modify its default configuration
 * @public
 */
export interface XModuleOptions<Module extends AnyXModule> {
  /** The options to override events that will be emitted when a the getters value or the state of the store changes */
  storeEmitters?: Partial<StoreEmitters<Module['storeModule']>>;
  /** The options to override the default store module configuration */
  storeModule?: XStoreModuleOptions<Module['storeModule']>;
  /** The options to override the default wiring configuration for the module */
  wiring?: Partial<Wiring>;
}

/**
 * Options for overriding a default {@link XStoreModule}
 *
 * @public
 */
export type XStoreModuleOptions<
  StoreModule extends AnyXStoreModule
> = StoreModule extends XStoreModule<infer State, infer Getters, infer Mutations, infer Actions>
  ? {
      state?: DeepPartial<State> & Dictionary;
      actions?: DeepPartial<ActionsTree<State, Getters, Mutations, Actions>> & AnyActionsTree;
      getters?: DeepPartial<GettersTree<State, Getters>> & AnyGettersTree;
      mutations?: DeepPartial<MutationsTree<State, Mutations>> & AnyMutationsTree;
    }
  : never;

/**
 * Alias for any store modules options. Use only when you don't care about the module concrete type
 *
 * @public
 */
export type AnyXStoreModuleOptions = XStoreModuleOptions<AnyXStoreModule>;
