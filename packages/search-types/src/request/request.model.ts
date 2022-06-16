import { Filter } from '../facet/filter/filter.model';
import { Sort } from '../sort.model';

/**
 * Interface for any Request with a `query` parameter.
 *
 * @public
 */
export interface QueryableRequest {
  query: string;
}

/**
 * Interface for any Request with a `filters` parameter.
 *
 * @public
 */
export interface FilterableRequest {
  filters?: Record<string, Filter[]>;
}

/**
 * Interface for any Request which supports pagination.
 *
 * @public
 */
export interface PageableRequest {
  rows?: number;
  start?: number;
}

/**
 * Interface for any Request with sorting.
 *
 * @public
 */
export interface SortableRequest {
  sort?: Sort;
}

/**
 * Interface for any Request with tagging.
 *
 * @public
 */
export interface TrackableRequest {
  origin?: string;
}
/**
 * Interface to support extra params in any request.
 *
 * @public
 */
export interface ExtraParamsRequest {
  extraParams?: {
    [key: string]: unknown;
  };
}
