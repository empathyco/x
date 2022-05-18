import { PlatformResult } from './models/index';

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
