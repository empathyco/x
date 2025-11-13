import type {
  ExtraParamsRequest,
  FilterableRequest,
  QueryableRequest,
  TrackableRequest,
} from './request.model'

/**
 * The Request for the Facets endpoint.
 *
 * @public
 */
export interface FacetsRequest
  extends QueryableRequest,
    FilterableRequest,
    TrackableRequest,
    ExtraParamsRequest {}
