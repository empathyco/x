import { Suggestion } from '../suggestion.model';

/**
 * Response for the query suggestions endpoint.
 *
 * @public
 */
export interface QuerySuggestionsResponse {
  suggestions: Suggestion[];
}
