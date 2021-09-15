import { SuggestionsRequest } from '@empathyco/x-adapter';
import { Suggestion } from '@empathyco/x-types';
import { XActionContext, XStoreModule } from '../../../store';
import { StatusMutations, StatusState } from '../../../store/utils/status.helpers';
import { Dictionary } from '../../../utils';
import { QuerySuggestionsConfig } from '../config.types';

/**
 * QuerySuggestions store state.
 *
 * @public
 */
export interface QuerySuggestionsState extends StatusState {
  /** The query of the query suggestions module. Used to request the suggestions. */
  query: string;
  /** The suggestions for the query of the state. */
  suggestions: Suggestion[];
  /** The configuration of the query suggestions module. */
  config: QuerySuggestionsConfig;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
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
  /**
   * The full list of queries suggestions related to the query search.
   *
   */
  querySuggestions: Suggestion[];
}

/**
 * QuerySuggestions store mutations.
 *
 * @public
 */
export interface QuerySuggestionsMutations extends StatusMutations {
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
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
}

/**
 * QuerySuggestions store actions.
 *
 * @public
 */
export interface QuerySuggestionsActions {
  /**
   * Cancels / interrupt {@link QuerySuggestionsActions.fetchAndSaveSuggestions} synchronous
   * promise.
   */
  cancelFetchAndSaveSuggestions(): void;
  /**
   * Requests and returns a list of suggestions based on the module state.
   *
   * @returns A new list of suggestions.
   */
  fetchSuggestions(): Suggestion[];
  /**
   * Requests and saves to the state a list of suggestions.
   */
  fetchAndSaveSuggestions(): void;
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

/**
 * Alias type for actions context of the {@link QuerySuggestionsXStoreModule}.
 *
 * @public
 */
export type QuerySuggestionsActionContext = XActionContext<
  QuerySuggestionsState,
  QuerySuggestionsGetters,
  QuerySuggestionsMutations,
  QuerySuggestionsActions
>;
