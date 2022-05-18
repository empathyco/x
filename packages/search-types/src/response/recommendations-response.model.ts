import { Result } from '../result/result.model';

/**
 * Response for the recommendations endpoint.
 *
 * @public
 */
export interface RecommendationsResponse {
  results: Result[];
}
