import { BooleanFilter } from './boolean-filter.model';
import { Filter } from './filter.model';

/**
 * A type of filter used in {@link SimpleFacet} and extends from {@link Filter}.
 * It can be selected or not.
 *
 * @public
 */
export interface SimpleFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'SimpleFilter';
}

/**
 * Type guard to check if a filter is a {@link SimpleFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link SimpleFilter}, false otherwise.
 *
 * @public
 */
export function isSimpleFilter(filter: Filter): filter is SimpleFilter {
  return filter.modelName === 'SimpleFilter';
}
