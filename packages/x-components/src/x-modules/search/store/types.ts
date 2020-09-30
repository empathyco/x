import { SearchRequest, SearchResponse } from '@empathy/search-adapter';
import { Facet, RelatedTag, Result } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { SearchConfig } from '../config.types';

/**
 * Search store state.
 *
 * @public
 */
export interface SearchState {
  /** The internal query of the module. Used to request the search results. */
  query: string;
  /** The list of the results, related to the `query` property of the state. */
  results: Result[];
  /** The list of the facets, related to the `query` property of the state. */
  facets: Facet[];
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
export interface SearchMutations {
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
   * @param related - Tags - The new related tags to save to the state.
   */
  setRelatedTags(relatedTags: RelatedTag[]): void;
}

/**
 * Search store actions.
 *
 * @public
 */
export interface SearchActions {
  /**
   * Fetchs the search response and returns them.
   *
   * @returns The new search response.
   */
  fetchSearchResponse(): SearchResponse;
  /**
   * Fetchs a new search response and stores them in the module state.
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
