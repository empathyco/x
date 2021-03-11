import { BooleanFilter, HierarchicalFilter } from '@empathy/search-types';

/**
 * Checks if a filter is selected.
 *
 * @param filter - The filter to check if it is selected.
 * @returns True when the filter is selected. False otherwise.
 * @public
 */
export const isFilterSelected = (filter: BooleanFilter): boolean => filter.selected;

/**
 * Checks if a filter is partially selected. Being partially selected means having either only some
 * child filters selected, or having some child filter partially selected.
 *
 * @param filter - The filter to check if it is partially selected.
 * @returns True if the filter is partially selected. False otherwise.
 * @public
 */
export function isFilterPartiallySelected(filter: HierarchicalFilter): boolean {
  const selectedChildren = filter.children.filter(isFilterSelected);
  return (
    (selectedChildren.length > 0 && selectedChildren.length < filter.children.length) ||
    selectedChildren.some(isFilterPartiallySelected)
  );
}
