import { NextQuery } from '../query-signals/next-query.model';

/**
 * Response for the next queries endpoint.
 *
 * @public
 */
export interface NextQueriesResponse {
  nextQueries: NextQuery[];
}
