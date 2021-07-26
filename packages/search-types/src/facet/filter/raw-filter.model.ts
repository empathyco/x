import { Filter } from './filter.model';

/**
 * A filter which id is the value of the filter. It can be selected or not.
 *
 * @public
 */
export interface RawFilter extends Filter {
  /** The value of the filter. */
  id: string;
  /** Model name to indicate the filter type. */
  modelName: 'RawFilter';
  /** Force {@link Filter#selected | Filter selected} property to true */
  selected: true;
}

/**
 * Type guard to check if a filter is a {@link RawFilter}.
 *
 * @param filter - The filter to check.
 *
 * @public
 */
export function isRawFilter(filter: Filter): filter is RawFilter {
  return filter.modelName === 'RawFilter';
}
