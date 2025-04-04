import type { PlatformSemanticQuery } from '../models';

/**
 * Response for the `semantic queries` endoint.
 *
 * @public
 */
export interface PlatformSemanticQueriesResponse {
  data: {
    candidates: PlatformSemanticQuery[];
  };
}
