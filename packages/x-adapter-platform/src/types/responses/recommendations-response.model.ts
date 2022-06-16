import { PlatformResult } from '../models/result.model';

/**
 * Response for the `recommendations` endpoint.
 *
 * @public
 */
export interface PlatformRecommendationsResponse {
  topclicked: {
    content: PlatformResult[];
    numFound: number;
  };
}
