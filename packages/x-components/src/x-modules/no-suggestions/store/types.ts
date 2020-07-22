import { XStoreModule } from '../../../store/store.types';

/**
 * NoSuggestions store state.
 *
 * @public
 */
export interface NoSuggestionsState {
  /** The query of the no suggestions module. Used to render the component conditionally. */
  query: string;
}

/**
 * NoSuggestions store getters.
 *
 * @public
 */
export interface NoSuggestionsGetters {}

/**
 * NoSuggestions store mutations.
 *
 * @public
 */
export interface NoSuggestionsMutations {
  /**
   * Sets the query of the no suggestions module.
   *
   * @param newQuery - The new query.
   */
  setQuery(newQuery: string): void;
}

/**
 * NoSuggestions store actions.
 *
 * @public
 */
export interface NoSuggestionsActions {}

/**
 * NoSuggestions type safe store module.
 *
 * @public
 */
export type NoSuggestionsXStoreModule = XStoreModule<
  NoSuggestionsState,
  NoSuggestionsGetters,
  NoSuggestionsMutations,
  NoSuggestionsActions
>;
