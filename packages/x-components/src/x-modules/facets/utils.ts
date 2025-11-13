import type { Facet, Filter, HierarchicalFilter } from '@empathyco/x-types'
import { isHierarchicalFacet } from '@empathyco/x-types'

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
  hierarchicalFilters: HierarchicalFilter[],
): HierarchicalFilter[] {
  return hierarchicalFilters.reduce(function flat(flattenedFilters, filter): HierarchicalFilter[] {
    flattenedFilters.push(filter)
    return filter?.children?.reduce(flat, flattenedFilters) ?? flattenedFilters
  }, [] as HierarchicalFilter[])
}

/**
 * Flattens all filters from an array of facets, including hierarchical filters.
 *
 * @param facets - The list of facets to extract filters from.
 * @returns A flat array of all filters from all facets.
 *
 * @public
 */
export function flattenAllFilters(facets: Facet[]): Filter[] {
  const allFilters: Filter[] = []
  facets.forEach(facet => {
    if (isHierarchicalFacet(facet)) {
      allFilters.push(...flatHierarchicalFilters(facet.filters))
    } else {
      allFilters.push(...facet.filters)
    }
  })
  return allFilters
}

/**
 * Recursively applies the selected state to hierarchical filters and their children.
 *
 * @param filters - The hierarchical filters to update.
 * @param selectedIds - The set of selected filter ids.
 *
 * @public
 */
export function applyHierarchicalSelection(
  filters: HierarchicalFilter[],
  selectedIds: Set<string | number>,
): void {
  filters.forEach(filter => {
    filter.selected = selectedIds.has(filter.id)
    if (filter.children && filter.children.length > 0) {
      applyHierarchicalSelection(filter.children, selectedIds)
      // If any child is selected, parent should be selected (to match x behavior)
      if (filter.children.some(child => child.selected)) {
        filter.selected = true
      }
    }
  })
}
