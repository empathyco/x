import { HistoryQuery, Suggestion, PopularSearchesRequest } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext, XStoreModule } from '../../../store';
import { StatusMutations, StatusState } from '../../../store/utils/status-store.utils';
import { PopularSearchesConfig } from '../config.types';

/**
 * Popular searches module state.
 *
 * @public
 */
export interface PopularSearchesState extends StatusState {
  /** The suggestions list. These suggestions represent the most searched queries. */
  popularSearches: Suggestion[];
  /** The popular searches module configuration. */
  config: PopularSearchesConfig;
  /** The list of the searched queries, related to the `query` property of the state. */
  //TODO Changes to uses the base extended class Previewable or what we decide.
  searchedQueries: HistoryQuery[];
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
}

/**
 * Popular searches module getters.
 *
 * @public
 */
export interface PopularSearchesGetters {
  /** The request object to retrieve popular searches. */
  request: PopularSearchesRequest;
  /** List of the Popular Searches. */
  popularSearches: Suggestion[];
}

/**
 * Popular searches module mutations.
 *
 * @public
 */
export interface PopularSearchesMutations extends StatusMutations {
  /**
   * Sets the suggestions of the module.
   *
   * @param suggestions - The new suggestions list.
   */
  setSuggestions(suggestions: Suggestion[]): void;
  /**
   * Sets the searched queries of the module.
   *
   * @param searchedQueries - The searched queries to save to the state.
   */
  setSearchedQueries(searchedQueries: HistoryQuery[]): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
}

/**
 * Popular searches module actions.
 *
 * @public
 */
export interface PopularSearchesActions {
  /**
   * Cancels / interrupt {@link PopularSearchesActions.fetchAndSaveSuggestions} synchronous promise.
   */
  cancelFetchAndSaveSuggestions(): void;
  /**
   * Fetches a new set of suggestions and returns them.
   *
   * @returns The new set of suggestions.
   */
  fetchSuggestions(request: PopularSearchesRequest): Suggestion[];
  /**
   * Fetches a new set of suggestions and stores them in the module state.
   */
  fetchAndSaveSuggestions(request: PopularSearchesRequest): void;
}

/**
 * Popular searches store module.
 *
 * @public
 */
export type PopularSearchesXStoreModule = XStoreModule<
  PopularSearchesState,
  PopularSearchesGetters,
  PopularSearchesMutations,
  PopularSearchesActions
>;

/**
 * Alias type for actions context of the {@link PopularSearchesXStoreModule}.
 *
 * @public
 */
export type PopularSearchesActionContext = XActionContext<
  PopularSearchesState,
  PopularSearchesGetters,
  PopularSearchesMutations,
  PopularSearchesActions
>;
