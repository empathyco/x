import {
  PlatformExtraParamsRequest,
  PlatformPageableRequest,
  PlatformQueryableRequest,
  PlatformTrackableRequest
} from './request.types';

/**
 * Base request for the `identifier results` endpoint.
 *
 * @public
 */
export interface BasePlatformIdentifierResultsRequest
  extends PlatformQueryableRequest,
    PlatformPageableRequest,
    PlatformTrackableRequest {}

/**
 * Request for the `identifier results` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformIdentifierResultsRequest
  extends BasePlatformIdentifierResultsRequest,
    PlatformExtraParamsRequest {}
