import { Filter } from '@empathy/search-types';

/**
 * Compares two filters array using the id of each filter, no matter the order.
 *
 * @param newFilters - New filters array.
 * @param oldFilters - Old filters array.
 *
 * @returns True if filters arrays are different. False if are not different.
 */
export function areFiltersDifferent(newFilters: Filter[], oldFilters: Filter[]): boolean {
  return (
    newFilters.length !== oldFilters.length ||
    newFilters.some(newFilter => !oldFilters.find(oldFilter => oldFilter.id === newFilter.id))
  );
}
