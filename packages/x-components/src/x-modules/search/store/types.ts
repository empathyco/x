import {
  Banner,
  Facet,
  Filter,
  PartialResult,
  Promoted,
  Redirection,
  RelatedTag,
  Result,
  Sort,
  TaggingRequest,
  SearchRequest,
  SearchResponse
} from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext, XStoreModule } from '../../../store';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { StatusMutations, StatusState } from '../../../store/utils/status-store.utils';
import { QueryOrigin, QueryOriginInit } from '../../../types/origin';
import { UrlParams } from '../../../types/url-params';
import { SearchConfig } from '../config.types';
import { InternalSearchRequest, WatchedInternalSearchRequest } from '../types';

/**
 * Search store state.
 *
 * @public
 */
export interface SearchState extends StatusState, QueryState {
  /** The list of the banners, related to the `query` property of the state. */
  banners: Banner[];
  /** The configuration of the search module. */
  config: SearchConfig;
  /** The list of the facets, related to the `query` property of the state. */
  facets: Facet[];
  /** A flag to indicate if new results are append to the current instead of replacing them. */
  isAppendResults: boolean;
  /** The origin property of the request. */
  origin: QueryOrigin | null;
  /** The current page of the request. */
  page: number;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
  /** The list of the partial results, related to the `query` property of the state. */
  partialResults: PartialResult[];
  /** The list of the promoted, related to the `query` property of the state. */
  promoteds: Promoted[];
  /** The internal query of the module. Used to request the search results. */
  query: string;
  /** The query tagging used to track the search events. */
  queryTagging: TaggingRequest;
  /** The redirections associated to the `query`. */
  redirections: Redirection[];
  /** The list of the related tags, related to the `query` property of the state. */
  relatedTags: RelatedTag[];
  /** The list of the results, related to the `query` property of the state. */
  results: Result[];
  /**
   * The dictionary of selected filters, used to perform the search request.
   * The key is the facet id, and the value the list of filters for that facet.
   */
  selectedFilters: Dictionary<Filter[]>;
  /** The way of ordering the results. */
  sort: Sort;
  /** The spellcheckedQuery property of the state. */
  spellcheckedQuery: string;
  /** The total number of results, related to the `query` property of the state. */
  totalResults: number;
}

/**
 * Search store getters.
 *
 * @public
 */
export interface SearchGetters {
  /**
   * The adapter request object for retrieving the results, or null if there is no
   * valid data to create a request.
   */
  request: InternalSearchRequest | null;
  /** The combination of the query and the selected related tags. */
  query: string;
}

/**
 * Search store mutations.
 *
 * @public
 */
export interface SearchMutations extends StatusMutations, QueryMutations {
  /**
   * Append the results to the results state.
   *
   * @param results - Results array.
   */
  appendResults(results: Result[]): void;
  /**
   * Updates a result with new fields.
   *
   * @param result - A result containing at least an id, and the properties to modify.
   */
  updateResult(result: Partial<Result> & Pick<Result, 'id'>): void;
  /**
   * Sets the banners of the module.
   *
   * @param banners - The new banners to save to the state.
   */
  setBanners(banners: Banner[]): void;
  /**
   * Sets the facets of the module.
   *
   * @param facets - The new facets to save to the state.
   */
  setFacets(facets: Facet[]): void;
  /**
   * Set the the `isAppendResuls` flag value.
   *
   * @param isAppendResults - The new flag value.
   */
  setIsAppendResults(isAppendResults: boolean): void;
  /**
   * Sets the origin of the module.
   *
   * @param origin - The new origin.
   */
  setOrigin(origin: QueryOrigin | undefined | null): void;
  /**
   * Sets the page of the module.
   *
   * @param page - The new page.
   */
  setPage(page: number): void;
  /**
   * Sets the page size of the module.
   *
   * @param pageSize - The new page size.
   */
  setPageSize(pageSize: number): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
  /**
   * Sets the partial results of the module.
   *
   * @param partialResults - The new partial results to save to the state.
   */
  setPartialResults(partialResults: PartialResult[]): void;
  /**
   * Sets the promoteds of the module.
   *
   * @param promoteds - The new promoted to save to the state.
   */
  setPromoteds(promoteds: Promoted[]): void;
  /**
   * Sets the query of the module, which is used to retrieve the results.
   *
   * @param newQuery - The new query to save to the state.
   */
  setQuery(newQuery: string): void;
  /**
   * Sets the query tagging of the module, which is used to track the query.
   *
   * @param queryTagging - The new query tagging object to save to the state.
   */
  setQueryTagging(queryTagging: TaggingRequest): void;
  /**
   * Sets the redirection of the module.
   *
   * @param redirections - The redirections to store.
   */
  setRedirections(redirections: Redirection[]): void;
  /**
   * Sets the related tags of the module.
   *
   * @param relatedTags - The new related tags to save to the state.
   */
  setRelatedTags(relatedTags: RelatedTag[]): void;
  /**
   * Sets the results of the module.
   *
   * @param results - The new results to save to the state.
   */
  setResults(results: Result[]): void;
  /**
   * Sets the selected filters of the module.
   *
   * @param selectedFilters - The new selected filters to save to the state.
   */
  setSelectedFilters(selectedFilters: Filter[]): void;
  /**
   * Sets the selected sort option of the module.
   *
   * @param sort - The new sort.
   */
  setSort(sort: Sort): void;
  /**
   * Sets the spellcheckedQuery of the module.
   *
   * @param spellcheckedQuery - The new spellcheck string to save to the state.
   */
  setSpellcheck(spellcheckedQuery: string): void;
  /**
   * Sets the total results of the module.
   *
   * @param totalResults - The new total results to save to the state.
   */
  setTotalResults(totalResults: number): void;
}

/**
 * Search store actions.
 *
 * @public
 */
export interface SearchActions {
  /**
   * Batches state resets in a single action after {@link SearchGetters.request} parameters update.
   *
   * @param watchedRequest - The watched internal search request object.
   */
  resetState(watchedRequest: WatchedInternalSearchRequest): void;
  /**
   * Cancels / interrupt {@link SearchActions.fetchAndSaveSearchResponse} synchronous promise.
   */
  cancelFetchAndSaveSearchResponse(): void;
  /**
   * Fetches a new search response and stores them in the module state.
   */
  fetchAndSaveSearchResponse(request: InternalSearchRequest | null): void;
  /**
   * Fetches the search response and returns them.
   *
   * @returns The new search response.
   */
  fetchSearchResponse(request: SearchRequest | null): SearchResponse;
  /**
   * Checks if there are more pages of results to load. If there are, then increases the page
   * number in state and set to `true` the {@link SearchState.isAppendResults} flag.
   *
   * @remarks This action is to implement the infinite scroll behaviour. To increase the page
   * for other purposes, please use the {@link SearchMutations.setPage} mutation.
   */
  increasePageAppendingResults(): void;
  /**
   * Checks if the url has params on it and then updates the state with these values.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams(urlParams: UrlParams): void;
  /**
   * Creates a {@link QueryOrigin} and saves it.
   *
   * @param originInit - The object to create the origin with.
   */
  saveOrigin(originInit: QueryOriginInit): void;
  /**
   * Saves the {@link @empathyco/x-types#SearchResponse}.
   *
   * @param response - The {@link @empathyco/x-types#SearchResponse} to save.
   */
  saveSearchResponse(response: SearchResponse): void;
}

/**
 * Search type safe store module.
 *
 * @public
 */
export type SearchXStoreModule = XStoreModule<
  SearchState,
  SearchGetters,
  SearchMutations,
  SearchActions
>;

/**
 * Alias type for actions context of the {@link SearchXStoreModule}.
 *
 * @public
 */
export type SearchActionContext = XActionContext<
  SearchState,
  SearchGetters,
  SearchMutations,
  SearchActions
>;
