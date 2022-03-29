import { XStoreModule } from '../../../store';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { UrlParams } from '../../../types/url-params';

/**
 * SearchBox store state.
 *
 * @public
 */
export interface SearchBoxState extends QueryState {
  /** The query of the search box input. */
  query: string;
}

/**
 * SearchBox store getters.
 *
 * @public
 */
export interface SearchBoxGetters {
  /** The query without initial or ending spaces. */
  trimmedQuery: string;
}

/**
 * SearchBox store mutations.
 *
 * @public
 */
export interface SearchBoxMutations extends QueryMutations {
  /**
   * Sets the new query of the search-box.
   *
   * @param newQuery - The new query of the search-box.
   */
  setQuery(newQuery: string): void;
}

/**
 * SearchBox store actions.
 *
 * @public
 */
export interface SearchBoxActions {
  /**
   * Checks if the url has a query on it and then updates the state with that value.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams(urlParams: UrlParams): void;
}

/**
 * SearchBox type safe store module.
 *
 * @public
 */
export type SearchBoxXStoreModule = XStoreModule<
  SearchBoxState,
  SearchBoxGetters,
  SearchBoxMutations,
  SearchBoxActions
>;
