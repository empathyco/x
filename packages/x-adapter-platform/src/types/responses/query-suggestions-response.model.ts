import { PlatformSuggestion } from '../models/suggestion.model';

/**
 * Response for the `query suggestions` endpoint.
 *
 * @public
 */
export interface PlatformQuerySuggestionsResponse {
  topTrends: {
    content: PlatformSuggestion[];
  };
}
