import { SearchAdapter } from '@empathy/search-adapter';
import { Store } from 'vuex';
import { CurrencyOptions } from '../i18n';
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
 * {@link XPlugin} Installation options.
 *
 * @public
 */
export interface XPluginOptions {
  /** The adapter transforms the request for the the search and tagging APIs and its responses. */
  adapter: SearchAdapter;
  /** A Vuex store to install the X module. If not passed a new one will be created and injected
   * into every component. */
  store?: Store<any>;
  /** The global {@link XConfig} accessible in any {@link XComponentAPI | XComponent}. */
  config?: XConfig;
  /** Override the default configuration of the {@link XModule | XModules}. */
  xModules?: XModulesOptions;
}

/**
 * The global configuration accessible from every component.
 *
 * @public
 */
export interface XConfig {
  /** Consent to send the user data (userId and sessionId) to our API. */
  consent: boolean;
  /** The {@link CurrencyOptions} to format currency values. */
  currencyOptions: CurrencyOptions;
  /** HTML dir attribute. Possible values are: ltr(left to right) or rtl(right to left). */
  documentDirection: DocumentDirection;
}

/**
 * The HTML document direction orientation. Possible values: ltr (left to right) or rtl (right
 * to left).
 *
 * @public
 */
export type DocumentDirection = 'ltr' | 'rtl';

/**
 * The XComponentAPI exposes access to the {@link XBus} and {@link XConfig} to the components.
 *
 * @public
 */
export interface XComponentAPI extends Pick<XBus, 'on'> {
  /* eslint-disable jsdoc/require-description-complete-sentence */
  /** {@inheritDoc XConfig} */
  config: XConfig;
  /** {@inheritDoc XBus.(emit:1)} */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /** {@inheritDoc XBus.(emit:2)} */
  emit<Event extends XEvent>(
    event: Event,
    payload: XEventPayload<Event>,
    metadata?: Omit<WireMetadata, 'moduleName'>
  ): void;
  /* eslint-enable jsdoc/require-description-complete-sentence */
}

/**
 * Options for overriding the default XModules configuration.
 *
 * @public
 */
export type XModulesOptions = {
  [N in XModuleName]?: XModuleOptions<XModulesTree[N]>;
};

/**
 * Options for overriding a default XModule configuration.
 *
 * @typeParam Module - The module name to modify its default configuration
 * @public
 */
export interface XModuleOptions<Module extends AnyXModule> {
  /** The options to override events that will be emitted when a the getters value or the state
   * of the store changes. */
  storeEmitters?: Partial<StoreEmitters<Module['storeModule']>>;
  /** The options to override the default store module configuration. */
  storeModule?: XStoreModuleOptions<Module['storeModule']>;
  /** The options to override the default wiring configuration for the module. */
  wiring?: Partial<Wiring>;
}

/**
 * Options for overriding a default {@link XStoreModule}.
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
 * Alias for any store modules options. Use only when you don't care about the module concrete type.
 *
 * @public
 */
export type AnyXStoreModuleOptions = XStoreModuleOptions<AnyXStoreModule>;
