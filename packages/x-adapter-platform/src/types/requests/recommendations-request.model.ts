import { PageableRequest, TrackableRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from './request.types';

/**
 * Base request for the Platform Recommendations endpoint.
 *
 * @public
 */
export interface BasePlatformRecommendationsRequest extends PageableRequest, TrackableRequest {}

/**
 * Request for Platform Recommendations endpoint with extra params.
 *
 * @public
 */
export interface PlatformRecommendationsRequest
  extends BasePlatformRecommendationsRequest,
    PlatformExtraParamsRequest {}
