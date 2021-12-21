import { SearchRequest } from '@empathyco/x-adapter';

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
