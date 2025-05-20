import type {
  ExtraParamsRequest,
  FilterableRequest,
  PageableRequest,
  SortableRequest,
} from './request.model'

/**
 * The Request for the Browse endpoint.
 *
 * @public
 */
export interface BrowseRequest
  extends PageableRequest,
    SortableRequest,
    FilterableRequest,
    ExtraParamsRequest {
  browseField: string
  browseValue: string
}
