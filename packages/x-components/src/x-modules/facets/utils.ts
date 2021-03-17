import {
  EditableNumberRangeFilter,
  Filter,
  isEditableNumberRangeFilter
} from '@empathy/search-types';

/**
 * Compares two filters array using
 * - the id of each filter for {@link @empathy/search-types#BooleanFilter | BooleanFilter}
 * - {@link areEditableNumberRangeFiltersDifferent} for
 * {@link @empathy/search-types#EditableNumberRangeFilter | EditableNumberRangeFilter}
 * no matter the order.
 *
 * @param newFilters - New filters array.
 * @param oldFilters - Old filters array.
 *
 * @returns True if filters arrays are different. False if are not different.
 */
export function areFiltersDifferent(newFilters: Filter[], oldFilters: Filter[]): boolean {
  return (
    newFilters.length !== oldFilters.length ||
    newFilters.some(
      newFilter =>
        !oldFilters.find(oldFilter => {
          if (isEditableNumberRangeFilter(oldFilter) && isEditableNumberRangeFilter(newFilter)) {
            return !areEditableNumberRangeFiltersDifferent(oldFilter, newFilter);
          }
          return oldFilter.id === newFilter.id;
        })
    )
  );
}

/**
 * Compares two {@link @empathy/search-types#EditableNumberRangeFilter | EditableNumberRangeFilter}
 * using its id and its `range.min` and `range.max` values.
 *
 * @param filterA - Filter A.
 * @param filterB - Filter B.
 *
 * @returns True if the filters are different.
 */
export function areEditableNumberRangeFiltersDifferent(
  filterA: EditableNumberRangeFilter,
  filterB: EditableNumberRangeFilter
): boolean {
  return (
    filterA.id !== filterB.id ||
    filterA.range.max !== filterB.range.max ||
    filterA.range.min !== filterB.range.min
  );
}

/**
 * Compares two queries to know if the new one is a refined query from the previous one or a new
 * one.
 *
 * A refined query is a query which has the previous query or part of it.
 * Example:
 * - previousQuery = 'lego star'.
 * - newQuery = 'lego star wars'.
 *
 * Example:
 * - previousQuery = 'lego star wars'.
 * - newQuery = 'lego star'.
 *
 * A new query is a query which has not the previous query.
 * Example:
 * - previousQuery = 'lego star'.
 * - newQuery = 'lego wars'.
 *
 * In this case, it is changing the word set, because a word is changed by another one, so
 * this is changing the search intention.
 *
 * @param newQuery - The new query.
 * @param previousQuery - The previous query.
 *
 * @returns A boolean which flags if the query is refined or not.
 */
export function isNewQuery(newQuery: string, previousQuery: string): boolean {
  const previousQueryWords = previousQuery.split(' ');
  const newQueryWords = newQuery.split(' ');
  return !previousQueryWords.every(previousQueryWord =>
    newQueryWords.some(
      newQueryWord =>
        newQueryWord.includes(previousQueryWord) || previousQueryWord.includes(newQueryWord)
    )
  );
}
