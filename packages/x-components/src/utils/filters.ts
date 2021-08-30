import { Filter } from '@empathyco/x-types';

/**
 * Compares if two lists contains the same filters.
 *
 * @param someFilters - A list of filters to compare.
 * @param anotherFilters - Another list of filters to compare.
 * @returns True if the two lists of filters are equal, which means that they have the same
 * filters. The position of the filter does not matter for this check.
 * @public
 */
export function areFiltersDifferent(someFilters: Filter[], anotherFilters: Filter[]): boolean {
  return (
    someFilters.length !== anotherFilters.length ||
    someFilters.some(filter => !anotherFilters.find(otherFilter => otherFilter.id === filter.id))
  );
}
