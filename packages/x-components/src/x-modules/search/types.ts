import { SearchRequest } from '@empathyco/x-types';

/**
 * An internal search request containing the page used to calculate the start and rows properties of
 * a {@link @empathyco/x-adapter#SearchRequest}.
 *
 * @public
 */
export interface InternalSearchRequest extends SearchRequest {
  /** The page number. */
  page: number;
}

/**
 * A representation of a watched {@link InternalSearchRequest} object, wrapping its new and old
 * values.
 *
 * @public
 */
export interface WatchedInternalSearchRequest {
  newRequest: InternalSearchRequest;
  oldRequest: InternalSearchRequest;
}
