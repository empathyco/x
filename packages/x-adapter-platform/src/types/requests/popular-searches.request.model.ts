import { PlatformExtraParamsRequest, PlatformPageableRequest } from './request.types';

/**
 * Base request for the `popular searches` endpoint.
 *
 * @public
 */
export interface BasePlatformPopularSearchesRequest extends PlatformPageableRequest {}

/**
 * Request for the `popular searches` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformPopularSearchesRequest
  extends BasePlatformPopularSearchesRequest,
    PlatformExtraParamsRequest {}
