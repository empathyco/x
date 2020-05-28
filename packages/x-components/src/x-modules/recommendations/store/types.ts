import { XStoreModule } from '../../../store';
import { RecommendationsConfig } from '../config.types';

/**
 * Recommendations store state.
 *
 * @public
 */
export interface RecommendationsState {
  /**
   * Configuration for the `Recommendations` module.
   */
  config: RecommendationsConfig;
}

/**
 * Recommendations store getters.
 *
 * @public
 */
export interface RecommendationsGetters {}

/**
 * Recommendations store mutations.
 *
 * @public
 */
export interface RecommendationsMutations {}

/**
 * Recommendations store actions.
 *
 * @public
 */
export interface RecommendationsActions {}

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
