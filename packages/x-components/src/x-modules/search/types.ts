import type { SearchRequest, SearchResponse } from '@empathyco/x-types'
import type { RequestStatus } from '../../store/utils/status-store.utils'

/**
 * An internal search request containing the page used to calculate the start and rows properties of
 * a {@link @empathyco/x-types#SearchRequest}.
 *
 * @public
 */
export interface InternalSearchRequest extends SearchRequest {
  /** The page number. */
  page: number
}

/**
 * A representation of a watched {@link InternalSearchRequest} object, wrapping its new and old
 * values.
 *
 * @public
 */
export interface WatchedInternalSearchRequest {
  newRequest: InternalSearchRequest
  oldRequest: InternalSearchRequest
}

/**
 * An internal search response containing the {@link InternalSearchRequest} performed to get a
 * {@link @empathyco/x-types#SearchResponse} and its {@link RequestStatus}.
 *
 * @public
 */
export interface InternalSearchResponse extends SearchResponse {
  /** The search request. */
  request: InternalSearchRequest
  /** The response status. */
  status: RequestStatus
}
