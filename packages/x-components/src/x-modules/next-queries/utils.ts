import { NextQuery } from '@empathy/search-types';

/**
 * Compares two arrays of next-queries.
 *
 * @param a - The first next-queries array to compare.
 * @param b - The second next-queries array to compare.
 * @returns True if the the next queries array has different length or any next query has a
 * different query.
 * @public
 */
export function areNextQueriesDifferent(a: NextQuery[], b: NextQuery[]): boolean {
  return a.length !== b.length || a.some((nextQuery, index) => nextQuery.query !== b[index].query);
}
