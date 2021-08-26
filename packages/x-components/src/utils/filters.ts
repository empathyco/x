import {
  Facet,
  Filter,
  HierarchicalFilter,
  isBooleanFilter,
  isEditableNumberRangeFilter,
  isHierarchicalFacet
} from '@empathyco/x-types';
import { Filter as FilterNext } from '@empathyco/x-types';
import { deepFlat } from './array';

/**
 * Compares if two lists contains the same filters.
 *
 * @param someFilters - A list of filters to compare.
 * @param anotherFilters - Another list of filters to compare.
 * @returns True if the two lists of filters are equal, which means that they have the same
 * filters. The position of the filter does not matter for this check.
 * @public
 */
export function areNextFiltersDifferent(
  someFilters: FilterNext[],
  anotherFilters: FilterNext[]
): boolean {
  return (
    someFilters.length !== anotherFilters.length ||
    someFilters.some(filter => !anotherFilters.find(otherFilter => otherFilter.id === filter.id))
  );
}

/**
 * Checks if a filter is selected.
 *
 * @param filter - The filter to check if it is selected.
 * @returns True when the filter is selected. False otherwise.
 * @public
 */
export function isFilterSelected(filter: Filter): boolean {
  return isBooleanFilter(filter)
    ? filter.selected
    : isEditableNumberRangeFilter(filter)
    ? filter.range.min !== null || filter.range.max !== null
    : false;
}

/**
 * Checks if a filter is partially selected. Being partially selected means having either only some
 * child filters selected, or having some child filter partially selected.
 *
 * @param filter - The filter to check if it is partially selected.
 * @returns True if the filter is partially selected. False otherwise.
 * @public
 */
export function isFilterPartiallySelected(filter: HierarchicalFilter): boolean {
  const selectedChildren = filter.children?.filter(isFilterSelected);
  const filterChildrenLength = filter.children?.length ?? 0;
  return (
    !!selectedChildren &&
    ((selectedChildren.length > 0 && selectedChildren.length < filterChildrenLength) ||
      selectedChildren.some(isFilterPartiallySelected))
  );
}

/**
 * Extracts the filters contained in the provided facets.
 *
 * @param facets - The facets from whom extract the array of filters.
 * @returns The array of the facets filters.
 * @public
 */
export function extractFilters(facets: Facet[] | Record<Facet['id'], Facet>): Filter[] {
  return Object.values(facets).reduce(flatFilters, []);
}

/**
 * Returns a filters object which contains facet's filters at the same depth level.
 *
 * @param filtersAccumulator - Accumulator object.
 * @param facet - Current facet object.
 * @returns Facet's filters object at the same depth level.
 */
function flatFilters(filtersAccumulator: Filter[], facet: Facet): Filter[] {
  const filters = isHierarchicalFacet(facet) ? deepFlat(facet.filters, 'children') : facet.filters;
  filtersAccumulator.push(...filters);
  return filtersAccumulator;
}
