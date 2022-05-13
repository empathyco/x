import { Result } from '../result/result.model';

/**
 * Response for the identifier results endpoint.
 *
 * @public
 */
export interface IdentifierResultsResponse {
  results: Result[];
}
