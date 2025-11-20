import type {
  PlatformExtraParamsRequest,
  PlatformFilterableRequest,
  PlatformQueryableRequest,
  PlatformTrackableRequest,
} from './request.types'

/**
 * Request for the `facets` endpoint.
 *
 * @public
 */
export interface PlatformFacetsRequest
  extends PlatformQueryableRequest,
    PlatformFilterableRequest,
    PlatformTrackableRequest,
    PlatformExtraParamsRequest {}
