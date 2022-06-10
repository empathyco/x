import {
  PlatformExtraParamsRequest,
  PlatformPageableRequest,
  PlatformTrackableRequest
} from './request.types';

/**
 * Request for `recommendations` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformRecommendationsRequest
  extends PlatformExtraParamsRequest,
    PlatformPageableRequest,
    PlatformTrackableRequest {}
