import type { BrowseRequest, BrowseResponse } from '@empathyco/x-types'
import type { RequestStatus } from '../../store/utils/status-store.utils'

/**
 * An internal browse request containing the page used to calculate the start and rows properties of
 * a {@link @empathyco/x-types#BrowseRequest}.
 *
 * @public
 */
export interface InternalBrowseRequest extends BrowseRequest {
  /** The page number. */
  page: number
}

/**
 * A representation of a watched {@link InternalBrowseRequest} object, wrapping its new and old
 * values.
 *
 * @public
 */
export interface WatchedInternalBrowseRequest {
  newRequest: InternalBrowseRequest
  oldRequest: InternalBrowseRequest
}

/**
 * An internal browse response containing the {@link InternalBrowseRequest} performed to get a
 * {@link @empathyco/x-types#BrowseResponse} and its {@link RequestStatus}.
 *
 * @public
 */
export interface InternalBrowseResponse extends BrowseResponse {
  /** The browse request. */
  request: InternalBrowseRequest
  /** The response status. */
  status: RequestStatus
}
