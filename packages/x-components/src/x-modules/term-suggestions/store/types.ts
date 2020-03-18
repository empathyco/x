import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { TermSuggestionsConfig } from '../config.types';

/**
 * TermSuggestions store state
 *
 * @public
 */
export interface TermSuggestionsState {
  /** The query of the term suggestions module. Used to request the suggestions */
  query: string;
  /** The suggestions for the query of the state */
  suggestions: Suggestion[];
  /** The configuration of the term suggestions module */
  config: TermSuggestionsConfig;
}
/**
 * TermSuggestions store getters
 *
 * @public
 */
export interface TermSuggestionsGetters {
  /** The adapter request object for retrieving the term suggestions, or null if there is not valid data to create a request */
  request: SuggestionsRequest | null;
}
/**
 * TermSuggestions store mutations
 *
 * @public
 */
export interface TermSuggestionsMutations {
  /**
   * Sets the query of the term suggestions module
   * @param newQuery - The new query
   */
  setQuery(newQuery: string): void;
  /**
   * Sets the suggestions of the module
   * @param suggestions - The suggestions list
   */
  setSuggestions(suggestions: Suggestion[]): void;
}
/**
 * TermSuggestions store actions
 *
 * @public
 */
export interface TermSuggestionsActions {
  /**
   * Requests and returns a list of suggestions based on the module state
   *
   * @returns A new list of suggestions
   */
  getSuggestions(): Suggestion[];
  /**
   * Requests and saves to the state a list of suggestions.
   */
  retrieveSuggestions(): void;
}
/**
 * TermSuggestions type safe store module
 *
 * @public
 */
export type TermSuggestionsXStoreModule = XStoreModule<
  TermSuggestionsState,
  TermSuggestionsGetters,
  TermSuggestionsMutations,
  TermSuggestionsActions
>;
