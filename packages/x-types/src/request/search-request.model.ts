import {
  ExtraParamsRequest,
  FilterableRequest,
  PageableRequest,
  QueryableRequest,
  SortableRequest,
  TrackableRequest
} from './request.model';

/**
 * The Request for the Search endpoint.
 *
 * @public
 */
export interface SearchRequest
  extends QueryableRequest,
    FilterableRequest,
    PageableRequest,
    SortableRequest,
    TrackableRequest,
    ExtraParamsRequest {}
