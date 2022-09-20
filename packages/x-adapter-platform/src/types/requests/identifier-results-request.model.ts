import {
  PlatformExtraParamsRequest,
  PlatformPageableRequest,
  PlatformQueryableRequest,
  PlatformTrackableRequest
} from './request.types';

/**
 * Request for the `identifier results` endpoint.
 *
 * @public
 */
export interface PlatformIdentifierResultsRequest
  extends PlatformQueryableRequest,
    PlatformPageableRequest,
    PlatformTrackableRequest,
    PlatformExtraParamsRequest {}
