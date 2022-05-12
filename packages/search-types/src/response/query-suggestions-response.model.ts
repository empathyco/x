import { Suggestion } from '../suggestion.model';

/**
 * Response for the suggestions endpoint.
 *
 * @public
 */
export interface QuerySuggestionsResponse {
  suggestions: Suggestion[];
}
