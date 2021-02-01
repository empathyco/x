import { SearchRequest, SearchResponse } from '@empathy/search-adapter';
import { Facet, Filter, RelatedTag, Result } from '@empathy/search-types';
import { XActionContext, XStoreModule } from '../../../store';
import { StatusMutations, StatusState } from '../../../store/utils/helpers/status.helpers';
import { Dictionary } from '../../../utils/types';
import { SearchConfig } from '../config.types';

/**
 * Search store state.
 *
 * @public
 */
export interface SearchState extends StatusState {
  /** The internal query of the module. Used to request the search results. */
  query: string;
  /** The list of the results, related to the `query` property of the state. */
  results: Result[];
  /** The list of the facets, related to the `query` property of the state. */
  facets: Facet[];
  /** The dictionary of selected filters, used to perform the search request.
   * The key is the facet id, and the value the list of filters for that facet. */
  selectedFilters: Dictionary<Filter[]>;
  /** The list of the related tags, related to the `query` property of the state. */
  relatedTags: RelatedTag[];
  /** The configuration of the search module. */
  config: SearchConfig;
}

/**
 * Search store getters.
 *
 * @public
 */
export interface SearchGetters {
  /** The adapter request object for retrieving the results, or null if there is not
   * valid data to create a request. */
  request: SearchRequest | null;
  /** List that contains the results.*/
  results: Result[];
}

/**
 * Search store mutations.
 *
 * @public
 */
export interface SearchMutations extends StatusMutations {
  /**
   * Sets the query of the module, which is used to retrieve the results.
   *
   * @param newQuery - The new query to save to the state.
   */
  setQuery(newQuery: string): void;
  /**
   * Sets the results of the module.
   *
   * @param results - The new results to save to the state.
   */
  setResults(results: Result[]): void;
  /**
   * Sets the facets of the module.
   *
   * @param facets - The new facets to save to the state.
   */
  setFacets(facets: Facet[]): void;
  /**
   * Sets the related tags of the module.
   *
   * @param relatedTags - The new related tags to save to the state.
   */
  setRelatedTags(relatedTags: RelatedTag[]): void;
  /**
   * Sets the selected filters of the module.
   *
   * @param selectedFilters - The new selected filters to save to the state.
   */
  setSelectedFilters(selectedFilters: Filter[]): void;
}

/**
 * Search store actions.
 *
 * @public
 */
export interface SearchActions {
  /**
   * Cancels / interrupt {@link SearchActions.fetchAndSaveSearchResponse} synchronous promise.
   */
  cancelFetchAndSaveSearchResponse(): void;
  /**
   * Fetches the search response and returns them.
   *
   * @returns The new search response.
   */
  fetchSearchResponse(): SearchResponse;
  /**
   * Fetches a new search response and stores them in the module state.
   */
  fetchAndSaveSearchResponse(): void;
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
