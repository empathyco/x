import {
  PlatformExtraParamsRequest,
  PlatformFilterableRequest,
  PlatformPageableRequest,
  PlatformQueryableRequest,
  PlatformSortableRequest,
  PlatformTrackableRequest
} from './request.types';

/**
 * Request for the `search` endpoint.
 *
 * @public
 */
export interface PlatformSearchRequest
  extends PlatformQueryableRequest,
    PlatformPageableRequest,
    PlatformFilterableRequest,
    PlatformTrackableRequest,
    PlatformSortableRequest,
    PlatformExtraParamsRequest {}
