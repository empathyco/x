import { PlatformResult } from '../models/result.model';

/**
 * Response for the `identifier results` endpoint.
 *
 * @public
 */
export interface PlatformIdentifierResultsResponse {
  catalog: {
    content: PlatformResult[];
    tagging: {
      query: string;
    };
  };
}
