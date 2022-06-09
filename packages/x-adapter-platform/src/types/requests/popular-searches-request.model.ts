import { PlatformExtraParamsRequest, PlatformPageableRequest } from './request.types';

/**
 * Platform request for the `popular searches` endpoint.
 *
 * @public
 */
export interface PlatformPopularSearchesRequest
  extends PlatformPageableRequest,
    PlatformExtraParamsRequest {}
