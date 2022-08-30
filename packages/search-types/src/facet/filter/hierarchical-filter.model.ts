import { BooleanFilter } from './boolean-filter.model';
import { Filter } from './filter.model';

/**
 * A type of filter used in {@link HierarchicalFacet} and extends from {@link BooleanFilter}.
 * This filter has the particularity that it has recursive children.
 *
 * @public
 */
export interface HierarchicalFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'HierarchicalFilter';
  /** A unique id used to reference the parent filter or null if it hasn't. */
  parentId: Filter['id'] | null;
  /** Descendants filters. */
  children?: HierarchicalFilter[];
}

/**
 * Type guard to check if a filter is a {@link HierarchicalFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link HierarchicalFilter}, false otherwise.
 *
 * @public
 */
export function isHierarchicalFilter(filter: Filter): filter is HierarchicalFilter {
  return filter.modelName === 'HierarchicalFilter';
}
