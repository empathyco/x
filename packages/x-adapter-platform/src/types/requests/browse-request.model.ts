import type {
  PlatformBrowsableRequest,
  PlatformExtraParamsRequest,
  PlatformFilterableRequest,
  PlatformPageableRequest,
  PlatformSortableRequest,
  PlatformTrackableRequest,
} from './request.types'

/**
 * Request for the `browse` endpoint.
 *
 * @public
 */
export interface PlatformBrowseRequest
  extends
    PlatformBrowsableRequest,
    PlatformPageableRequest,
    PlatformFilterableRequest,
    PlatformTrackableRequest,
    PlatformSortableRequest,
    PlatformExtraParamsRequest {}
