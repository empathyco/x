import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { PopularSearchesConfig } from '../config.types';

/**
 * Popular searches module state.
 *
 * @public
 */
export interface PopularSearchesState {
  /** The suggestions list. These suggestions represent the most searched queries. */
  suggestions: Suggestion[];
  /** The popular searches module configuration. */
  config: PopularSearchesConfig;
}

/**
 * Popular searches module getters.
 *
 * @public
 */
export interface PopularSearchesGetters {
  /** The request object to retrieve popular searches. */
  request: SuggestionsRequest;
}

/**
 * Popular searches module mutations.
 *
 * @public
 */
export interface PopularSearchesMutations {
  /**
   * Sets the suggestions of the module.
   *
   * @param suggestions - The new suggestions list.
   * */
  setSuggestions(suggestions: Suggestion[]): void;
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
  getSuggestions(): Promise<Suggestion[]>;
  /**
   * Gets an new set of suggestions and stores them in the module state.
   */
  retrieveSuggestions(): void;
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
