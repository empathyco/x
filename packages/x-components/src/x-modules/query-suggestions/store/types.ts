import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { QuerySuggestionsConfig } from '../config.types';

/**
 * QuerySuggestions store state.
 *
 * @public
 */
export interface QuerySuggestionsState {
  /** The query of the query suggestions module. Used to request the suggestions. */
  query: string;
  /** The suggestions for the query of the state. */
  suggestions: Suggestion[];
  /** The configuration of the query suggestions module. */
  config: QuerySuggestionsConfig;
}
/**
 * QuerySuggestions store getters.
 *
 * @public
 */
export interface QuerySuggestionsGetters {
  /** The adapter request object for retrieving the query suggestions, or null if there is not
   * valid data to create a request. */
  request: SuggestionsRequest | null;
  /** The normalized module's query. */
  normalizedQuery: string;
}
/**
 * QuerySuggestions store mutations.
 *
 * @public
 */
export interface QuerySuggestionsMutations {
  /**
   * Sets the query of the query suggestions module.
   *
   * @param newQuery - The new query.
   */
  setQuery(newQuery: string): void;
  /**
   * Sets the suggestions of the module.
   *
   * @param suggestions - The suggestions list.
   */
  setSuggestions(suggestions: Suggestion[]): void;
}
/**
 * QuerySuggestions store actions.
 *
 * @public
 */
export interface QuerySuggestionsActions {
  /**
   * Requests and returns a list of suggestions based on the module state.
   *
   * @returns A new list of suggestions.
   */
  getSuggestions(): Suggestion[];
  /**
   * Requests and saves to the state a list of suggestions.
   */
  getAndSaveSuggestions(): void;
}
/**
 * QuerySuggestions type safe store module.
 *
 * @public
 */
export type QuerySuggestionsXStoreModule = XStoreModule<
  QuerySuggestionsState,
  QuerySuggestionsGetters,
  QuerySuggestionsMutations,
  QuerySuggestionsActions
>;
