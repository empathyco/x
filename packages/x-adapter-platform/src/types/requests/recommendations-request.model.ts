import {
  PlatformExtraParamsRequest,
  PlatformPageableRequest,
  PlatformTrackableRequest
} from './request.types';

/**
 * Base request for the `recommendations` endpoint.
 *
 * @public
 */
export interface BasePlatformRecommendationsRequest
  extends PlatformPageableRequest,
    PlatformTrackableRequest {}

/**
 * Request for `recommendations` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformRecommendationsRequest
  extends BasePlatformRecommendationsRequest,
    PlatformExtraParamsRequest {}
