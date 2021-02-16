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
