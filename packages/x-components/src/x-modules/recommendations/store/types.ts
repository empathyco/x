import { TopRecommendationsRequest } from '@empathy/search-adapter';
import { Result } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { RecommendationsConfig } from '../config.types';

/**
 * Recommendations store state.
 *
 * @public
 */
export interface RecommendationsState {
  /** Configuration for the `Recommendations` module. */
  config: RecommendationsConfig;
  /** Param to be sent on the recommendations request. */
  origin: string;
  /** The recommendations of the module. */
  recommendations: Result[];
}

/**
 * Recommendations store getters.
 *
 * @public
 */
export interface RecommendationsGetters {
  /** The adapter request object for retrieving the recommendations. */
  request: TopRecommendationsRequest;
}

/**
 * Recommendations store mutations.
 *
 * @public
 */
export interface RecommendationsMutations {
  /**
   * Sets the recommendations of the module.
   *
   * @param results - The recommendations list.
   */
  setRecommendations(results: Result[]): void;
}

/**
 * Recommendations store actions.
 *
 * @public
 */
export interface RecommendationsActions {
  /**
   * Requests and saves to the state a list of recommendations.
   */
  fetchAndSaveRecommendations(): void;
  /**
   * Requests and returns a list of recommendations based on the module state.
   *
   * @returns A new list of results.
   */
  fetchRecommendations(): Result[];
}

/**
 * Recommendations type safe store module.
 *
 * @public
 */
export type RecommendationsXStoreModule = XStoreModule<
  RecommendationsState,
  RecommendationsGetters,
  RecommendationsMutations,
  RecommendationsActions
>;
