import {
  Facet,
  Filter,
  HistoryQuery,
  NextQuery,
  PartialResult,
  Redirection,
  RelatedTag,
  Result,
  Suggestion,
  XComponentsAdapter
} from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { ActionsTree } from '../store/actions.types';
import { GettersTree } from '../store/getters.types';
import { MutationsTree } from '../store/mutations.types';
import { AnyXStoreModule, XStoreModule } from '../store/store.types';
import { RequestStatus } from '../store/utils/status-store.utils';
import { StoreEmitters } from '../store/utils/store-emitters.utils';
import { PropsWithType } from '../utils';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';
import { WireMetadata, Wiring } from '../wiring/wiring.types';
import { ScrollComponentState } from '../x-modules/scroll/index';
import { AnyXModule, ExtractState, XModuleName, XModulesTree } from '../x-modules/x-modules.types';
import { XBus } from './x-bus.types';

/**
 * {@link XPlugin} Installation options.
 *
 * @public
 */
export interface XPluginOptions {
  /** The adapter transforms the request for the the search and tagging APIs and its responses. */
  adapter: XComponentsAdapter;
  /**
   * A Vuex store to install the X module. If not passed a new one will be created and injected
   * into every component.
   */
  store?: Store<any>;
  /**
   * A {@link XModule | XModules} to be registered during the {@link XPlugin} installation.
   */
  initialXModules?: AnyXModule[];
  /**
   * Override the {@link XModule | XModules} config state and its wiring.
   */
  xModules?: XModulesOptions;
  /**
   * Override the {@link XModule | XModules} store module and store emitters. It must be used
   * only in exceptional cases.
   */
  __PRIVATE__xModules?: PrivateXModulesOptions;
}

/**
 * The HTML document direction orientation. Possible values: ltr (left to right) or rtl (right
 * to left).
 *
 * @public
 */
export type DocumentDirection = 'ltr' | 'rtl';

/**
 * The XComponentAPI exposes access to the {@link XBus}, and store aliases to the
 * components.
 *
 * @public
 */
export interface XComponentAPI extends XComponentBusAPI, XComponentAliasAPI {}

/**
 * API for emitting and subscribing to events of the {@link XBus}.
 *
 * @public
 */
export interface XComponentBusAPI {
  /* eslint-disable jsdoc/require-description-complete-sentence */
  /** {@inheritDoc XBus.(on:1)} */
  on: XBus['on'];
  /** {@inheritDoc XBus.(emit:1)} */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /** {@inheritDoc XBus.(emit:2)} */
  emit<Event extends XEvent>(
    event: Event,
    payload: XEventPayload<Event>,
    metadata?: Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>
  ): void;
  /* eslint-enable jsdoc/require-description-complete-sentence */
}

/**
 * Alias to facilitate retrieving values from the store.
 *
 * @public
 */
export interface XComponentAliasAPI {
  /** The {@link DeviceXModule} detected device. */
  readonly device: string | null;
  /** The {@link FacetsXModule} facets. */
  readonly facets: Record<Facet['id'], Facet>;
  /** The {@link HistoryQueriesXModule} history queries matching the query. */
  readonly historyQueries: ReadonlyArray<HistoryQuery>;
  /** The {@link HistoryQueriesXModule} history queries. */
  readonly fullHistoryQueries: ReadonlyArray<HistoryQuery>;
  /** The {@link IdentifierResultsXModule} results. */
  readonly identifierResults: ReadonlyArray<Result>;
  /** The {@link Empathize} is open state. */
  readonly isEmpathizeOpen: boolean;
  /** The {@link NextQueriesXModule} next queries. */
  readonly nextQueries: ReadonlyArray<NextQuery>;
  /** The {@link SearchXModule} no results situation. */
  readonly noResults: boolean;
  /** The {@link SearchXModule} partial results. */
  readonly partialResults: ReadonlyArray<PartialResult>;
  /** The {@link PopularSearchesXModule} popular searches. */
  readonly popularSearches: ReadonlyArray<Suggestion>;
  /** The query value of the different modules. */
  readonly query: XComponentAliasQueryAPI;
  /** The {@link QuerySuggestionsXModule} query suggestions. */
  readonly querySuggestions: ReadonlyArray<Suggestion>;
  /** The {@link RecommendationsXModule} recommendations. */
  readonly recommendations: ReadonlyArray<Result>;
  /** The {@link SearchXModule} redirections. */
  readonly redirections: ReadonlyArray<Redirection>;
  /** The {@link RelatedTagsXModule} related tags (Both selected and deselected). */
  readonly relatedTags: ReadonlyArray<RelatedTag>;
  /** The {@link SearchXModule} search results. */
  readonly results: ReadonlyArray<Result>;
  /** The {@link ScrollXModule} data state. */
  readonly scroll: Record<string, ScrollComponentState>;
  /** The {@link FacetsXModule} selected filters. */
  readonly selectedFilters: Filter[];
  /** The {@link RelatedTagsXModule} selected related tags. */
  readonly selectedRelatedTags: ReadonlyArray<RelatedTag>;
  /** The {@link SearchXModule} spellchecked query. */
  readonly spellcheckedQuery: string | null;
  /** The status value of the different modules. */
  readonly status: XComponentAliasStatusAPI;
  /** The {@link SearchXModule} total results. */
  readonly totalResults: number;
  /** The {@link SearchXModule} selected sort. */
  readonly selectedSort: string;
}

/**
 * Alias to facilitate retrieving the modules with query.
 *
 * @public
 */
export interface XComponentAliasQueryAPI {
  /** The {@link FacetsXModule} query. */
  readonly facets: string;
  /** The {@link SearchBoxXModule} query. */
  readonly searchBox: string;
  /** The {@link NextQueriesXModule} query. */
  readonly nextQueries: string;
  /** The {@link QuerySuggestionsXModule} query. */
  readonly querySuggestions: string;
  /** The {@link RelatedTagsXModule} query. */
  readonly relatedTags: string;
  /** The {@link SearchXModule} query. */
  readonly search: string;
}

/**
 * Alias to facilitate retrieving the modules with status.
 *
 * @public
 */
export interface XComponentAliasStatusAPI {
  /** The {@link IdentifierResultsXModule} status. */
  readonly identifierResults: RequestStatus | undefined;
  /** The {@link NextQueriesXModule} status. */
  readonly nextQueries: RequestStatus | undefined;
  /** The {@link PopularSearchesXModule} status. */
  readonly popularSearches: RequestStatus | undefined;
  /** The {@link QuerySuggestionsXModule} status. */
  readonly querySuggestions: RequestStatus | undefined;
  /** The {@link RecommendationsXModule} status. */
  readonly recommendations: RequestStatus | undefined;
  /** The {@link RelatedTagsXModule} status. */
  readonly relatedTags: RequestStatus | undefined;
  /** The {@link SearchXModule} status. */
  readonly search: RequestStatus | undefined;
}

/**
 * Options for overriding the default config state and wiring for each {@link XModule | XModule}.
 *
 * @public
 */
export type XModulesOptions = {
  [ModuleName in XModuleName]?: XModuleOptions<ModuleName>;
};

/**
 * Options for overriding the default config state and wiring for a {@link XModule | XModule}.
 *
 * @param ModuleName - The {@link XModuleName} to extract the config.
 * @public
 */
export interface XModuleOptions<ModuleName extends XModuleName> {
  /**
   * The options to override the default config state for the module.
   */
  config?: DeepPartial<ExtractState<ModuleName> extends { config: infer Config } ? Config : never>;
  /**
   * The options to override the default wiring configuration for the module.
   */
  wiring?: Partial<Wiring>;
}

/**
 * Options for overriding the default store module and store emitters for each
 * {@link XModule | XModule}.
 *
 * @public
 */
export type PrivateXModulesOptions = {
  [ModuleName in XModuleName]?: PrivateXModuleOptions<XModulesTree[ModuleName]>;
};

/**
 * Options for overriding the default store module and store emitters for a
 * {@link XModule | XModule}.
 *
 * @param Module - The {@link XModule | XModule} to modify its default configuration.
 * @public
 */
export interface PrivateXModuleOptions<Module extends AnyXModule> {
  /**
   * The options to override events that will be emitted when the getters value or the state
   * of the store changes.
   */
  storeEmitters?: Partial<StoreEmitters<Module['storeModule']>>;
  /**
   * The options to override the default store module configuration.
   */
  storeModule?: XStoreModuleOptions<Module['storeModule']>;
}

/**
 * Options for overriding a default {@link XStoreModule}.
 *
 * @public
 */
export type XStoreModuleOptions<StoreModule extends AnyXStoreModule> =
  StoreModule extends XStoreModule<infer State, infer Getters, infer Mutations, infer Actions>
    ? {
        state?: DeepPartial<State>;
        actions?: DeepPartial<ActionsTree<State, Getters, Mutations, Actions>>;
        getters?: DeepPartial<GettersTree<State, Getters>>;
        mutations?: DeepPartial<MutationsTree<State, Mutations>>;
      }
    : never;

/**
 * Alias for any store module option. Use only when you don't care about the module concrete type.
 *
 * @public
 */
export type AnyXStoreModuleOption = XStoreModuleOptions<AnyXStoreModule>;
