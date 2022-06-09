import { PlatformNextQuery } from '../models/next-query.model';

/**
 * Response for the `next queries` endpoint.
 *
 * @public
 */
export interface PlatformNextQueriesResponse {
  data: {
    nextqueries: PlatformNextQuery[];
  };
}
