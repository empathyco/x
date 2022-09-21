import { HierarchicalFilter } from '@empathyco/x-types';

/**
 * This function flattens the Hierarchical Filters, returning an array with all filters including
 * the children.
 *
 * @param hierarchicalFilters - The list of Hierarchical Filters to flatten.
 * @returns An array with all the Hierarchical filters.
 *
 * @public
 */
export function flatHierarchicalFilters(
  hierarchicalFilters: HierarchicalFilter[]
): HierarchicalFilter[] {
  return hierarchicalFilters.reduce(function flat(flattenedFilters, filter): HierarchicalFilter[] {
    flattenedFilters.push(filter);
    return filter?.children?.reduce(flat, flattenedFilters) ?? flattenedFilters;
  }, [] as HierarchicalFilter[]);
}
