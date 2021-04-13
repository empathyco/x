import {
  Facet,
  Filter,
  HierarchicalFilter,
  isBooleanFilter,
  isEditableNumberRangeFilter,
  isHierarchicalFacet
} from '@empathy/search-types';
import { deepFlat } from './array';

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
  const selectedChildren = filter.children.filter(isFilterSelected);
  return (
    (selectedChildren.length > 0 && selectedChildren.length < filter.children.length) ||
    selectedChildren.some(isFilterPartiallySelected)
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
