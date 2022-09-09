import { AnyXStoreModule, XStoreModule } from '../store/store.types';
import { StoreEmitters } from '../store/utils/store-emitters.utils';
import { Wiring } from '../wiring/wiring.types';
import { DeviceXModule } from './device/x-module';
import { EmpathizeXModule } from './empathize/x-module';
import { ExtraParamsXModule } from './extra-params';
import { FacetsXModule } from './facets/x-module';
import { HistoryQueriesXModule } from './history-queries/x-module';
import { IdentifierResultsXModule } from './identifier-results/x-module';
import { NextQueriesXModule } from './next-queries/x-module';
import { PopularSearchesXModule } from './popular-searches/x-module';
import { QueriesPreviewXModule } from './queries-preview/x-module';
import { QuerySuggestionsXModule } from './query-suggestions/x-module';
import { RecommendationsXModule } from './recommendations/x-module';
import { RelatedTagsXModule } from './related-tags/x-module';
import { ScrollXModule } from './scroll/x-module';
import { SearchBoxXModule } from './search-box/x-module';
import { SearchXModule } from './search/x-module';
import { TaggingXModule } from './tagging';
import { UrlXModule } from './url';

/**
 * Gives each {@link XModule} a name, that can be used to retrieve then its value.
 *
 * @public
 */
export interface XModulesTree {
  device: DeviceXModule;
  empathize: EmpathizeXModule;
  extraParams: ExtraParamsXModule;
  facets: FacetsXModule;
  historyQueries: HistoryQueriesXModule;
  identifierResults: IdentifierResultsXModule;
  nextQueries: NextQueriesXModule;
  popularSearches: PopularSearchesXModule;
  queriesPreview: QueriesPreviewXModule;
  querySuggestions: QuerySuggestionsXModule;
  recommendations: RecommendationsXModule;
  relatedTags: RelatedTagsXModule;
  scroll: ScrollXModule;
  search: SearchXModule;
  searchBox: SearchBoxXModule;
  tagging: TaggingXModule;
  url: UrlXModule;
}

/**
 * Names of all of the {@link XModule | XModules} available.
 *
 * @public
 */
export type XModuleName = keyof XModulesTree;

/**
 * A group of a wiring configuration, a store module, and side effects.
 *
 * @param StoreModule - The store module state type.
 * @public
 */
export interface XModule<StoreModule extends AnyXStoreModule> {
  /** A unique name that identifies this XModule. */
  name: XModuleName;
  /** Watchers for the store module that will emit an XEvent when changed. */
  storeEmitters: StoreEmitters<StoreModule>;
  /** The Vuex Store module associated to this module. */
  storeModule: StoreModule;
  /**
   * The wiring associated to this module. It must only access to the store module of this
   * XModule.
   */
  wiring: Partial<Wiring>;
}

/**
 * Alias for any XModule. Use with caution.
 *
 * @public
 */
export type AnyXModule = XModule<AnyXStoreModule>;

/**
 * Util type for extracting the state type of a module.
 *
 * @param Module - The module name to extract its state type.
 * @public
 */
export type ExtractState<Module extends XModuleName> = XModulesTree[Module] extends XModule<
  XStoreModule<infer State, any, any, any>
>
  ? State
  : never;

/**
 * Util type for extracting the getter type of a module.
 *
 * @param Module - The module name to extract its getters type.
 * @public
 */
export type ExtractGetters<Module extends XModuleName> = XModulesTree[Module] extends XModule<
  XStoreModule<any, infer Getter, any, any>
>
  ? Getter
  : never;
