import { Suggestion } from '../suggestion.model';

/**
 * Response for the popular searches endpoint.
 *
 * @public
 */
export interface PopularSearchesResponse {
  suggestions: Suggestion[];
}
