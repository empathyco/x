import { SuggestionsRequest } from '@empathy/search-adapter';
import { HistoryQuery, Suggestion } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { StatusMutations, StatusState } from '../../../store/utils/helpers/status.helpers';
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
}

/**
 * Popular searches module getters.
 *
 * @public
 */
export interface PopularSearchesGetters {
  /** The request object to retrieve popular searches. */
  request: SuggestionsRequest;
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
   * */
  setSuggestions(suggestions: Suggestion[]): void;
  /**
   * Sets the searched queries of the module.
   *
   * @param searchedQueries - The searched queries to save to the state.
   */
  setSearchedQueries(searchedQueries: HistoryQuery[]): void;
}

/**
 * Popular searches module actions.
 *
 * @public
 */
export interface PopularSearchesActions {
  /**
   * Gets a new set of suggestions and returns them.
   *
   * @returns The new set of suggestions.
   */
  getSuggestions(): Suggestion[];
  /**
   * Gets a new set of suggestions and stores them in the module state.
   */
  getAndSaveSuggestions(): void;
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
