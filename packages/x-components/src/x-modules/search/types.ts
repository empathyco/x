import { SearchRequest } from '@empathyco/x-adapter';

/**
 * A pageable search request.
 *
 * @public
 */
export interface PageableSearchRequest extends SearchRequest {
  /** The page number. */
  page?: number;
}
