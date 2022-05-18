import {
  PlatformExtraParamsRequest,
  PlatformFilterableRequest,
  PlatformPageableRequest,
  PlatformQueryableRequest,
  PlatformSortableRequest,
  PlatformTrackableRequest
} from './request.types';

/**
 * Base request for the `search` endpoint.
 *
 * @public
 */
export interface BasePlatformSearchRequest
  extends PlatformQueryableRequest,
    PlatformPageableRequest,
    PlatformFilterableRequest,
    PlatformTrackableRequest,
    PlatformSortableRequest {}

/**
 * Request for the `search` endpoint with `extra params`.
 *
 * @public
 */
export interface PlatformSearchRequest
  extends BasePlatformSearchRequest,
    PlatformExtraParamsRequest {}
