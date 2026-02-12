import type { FacetsRequest, Filter, RawFilter } from '@empathyco/x-types'

/**
 * Compares if two lists contains the same filters.
 *
 * @param filtersA - A list of filters to compare.
 * @param filtersB - Another list of filters to compare.
 *
 * @returns True if the two lists of filters are equal, which means that they have the same
 * filters. The position of the filter does not matter for this check.
 *
 * @public
 */
export function areFiltersDifferent(filtersA: Filter[], filtersB: Filter[]): boolean {
  return (
    filtersA.length !== filtersB.length ||
    filtersA.some(filter => !filtersB.find(otherFilter => otherFilter.id === filter.id))
  )
}

/**
 * Compares if two filter dictionaries are different, ignoring empty filter arrays.
 *
 * @param filtersA - A filter dictionary to compare.
 * @param filtersB - Another filter dictionary to compare.
 *
 * @returns True if the filter dictionaries are different, false if they are equivalent.
 * Empty objects (\{\}) and objects with only empty arrays (\{brand: [], category: []\}) are
 * treated as equivalent since they both represent no active filters.
 *
 * @public
 */
export function areFilterDictionaryDifferent(
  filtersA: Record<string, Filter[]>,
  filtersB: Record<string, Filter[]>,
): boolean {
  const allKeys = new Set([...Object.keys(filtersA), ...Object.keys(filtersB)])

  for (const key of allKeys) {
    const arrayA = filtersA[key] || []
    const arrayB = filtersB[key] || []

    // Skip if both arrays are empty (equivalent to no filters)
    if (arrayA.length === 0 && arrayB.length === 0) {
      continue
    }

    // Compare the filter arrays (handles length and content differences)
    if (areFiltersDifferent(arrayA, arrayB)) {
      return true
    }
  }

  return false
}

/**
 * Compares if two facets requests are different.
 *
 * @param requestA - A facets request.
 * @param requestB - Another facets request.
 *
 * @returns True if the requests are different, false if they are equivalent.
 * Handles semantic equivalence of filter states (empty object vs object with empty arrays).
 *
 * @public
 */
export function areRequestsDifferent(
  requestA: FacetsRequest | null,
  requestB: FacetsRequest | null,
): boolean {
  // Reference equality check
  if (requestA === requestB) return false

  // Null transition check
  if (requestA === null || requestB === null) return true

  // Compare query
  if (requestA.query !== requestB.query) return true

  // Compare extraParams (shallow, simple)
  if (JSON.stringify(requestA.extraParams || {}) !== JSON.stringify(requestB.extraParams || {}))
    return true

  // Use semantic filter comparison to avoid duplicate emissions
  // when filters go from {} to {brand: [], category: []}
  return areFilterDictionaryDifferent(requestA.filters || {}, requestB.filters || {})
}

/**
 * Helper method which creates the filter entity from the filter ir of the url.
 *
 * @param filterIds - List of filter ids from the url.
 *
 * @returns A list of  filters.
 *
 * @public
 */
export function createRawFilters(filterIds: Array<Filter['id']>): RawFilter[] {
  return filterIds.map(filterId => {
    return {
      id: filterId as string,
      modelName: 'RawFilter',
      selected: true,
    }
  })
}
