import { XStoreModule } from '../../../store';

/**
 * SearchBox store state
 * @public
 */
export interface SearchBoxState {
  /** The query of the search box input */
  query: string;
}

/**
 * SearchBox store getters
 *
 * @public
 */
export interface SearchBoxGetters {
  /** The query without initial or ending spaces */
  trimmedQuery: string;
}

/**
 * SearchBox store mutations
 * @public
 */
export interface SearchBoxMutations {
  /**
   * Sets the new query of the search-box
   * @param newQuery - The new query of the search-box
   */
  setQuery(newQuery: string): void;
}

/**
 * SearchBox store actions
 * @public
 */
export interface SearchBoxActions {}

/**
 * SearchBox type safe store module
 * @public
 */
export type SearchBoxXStoreModule = XStoreModule<
  SearchBoxState,
  SearchBoxGetters,
  SearchBoxMutations,
  SearchBoxActions
>;
