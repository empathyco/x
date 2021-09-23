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

/**
 * Helper method which creates the {@link Filter} entity from the filter ir of the url.
 *
 * @param filterIds - List of filter ids from the url.
 *
 * @returns A list of {@link Filter | raw filter}.
 */
export const createRawFilters = (filterIds: (string | number)[]): Filter[] => {
  return filterIds.reduce<Filter[]>((acc, filterId) => {
    acc.push({
      id: filterId,
      modelName: 'RawFilter',
      selected: true
    });
    return acc;
  }, []);
};
