import type {
  BrowsableRequest,
  ExtraParamsRequest,
  FilterableRequest,
  PageableRequest,
  SortableRequest,
  TrackableRequest,
} from './request.model'

/**
 * The Request for the Browse endpoint.
 *
 * @public
 */
export interface BrowseRequest
  extends
    BrowsableRequest,
    FilterableRequest,
    PageableRequest,
    SortableRequest,
    TrackableRequest,
    ExtraParamsRequest {}
