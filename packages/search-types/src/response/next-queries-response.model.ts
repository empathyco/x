import { NextQuery } from '../query-signals';

/**
 * Response for the next queries endpoint.
 *
 * @public
 */
export interface NextQueriesResponse {
  nextQueries: NextQuery[];
}
