import { PlatformSuggestion } from '../models/suggestion.model';

/**
 * Response for the `popular searches` endpoint.
 *
 * @public
 */
export interface PlatformPopularSearchesResponse {
  topTrends: {
    content: PlatformSuggestion[];
  };
}
