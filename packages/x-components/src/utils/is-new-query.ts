import { isStringEmpty } from './string';

/**
 * Regex for splitting a query into its words.
 *
 * @public
 */
export const SPLIT_WORDS_REGEX = /[\s-]/;

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
 *
 * @public
 */
export function isNewQuery(newQuery: string, previousQuery: string): boolean {
  const isNewQueryEmpty = isStringEmpty(newQuery);
  const isPreviousQueryEmpty = isStringEmpty(previousQuery);
  const previousQueryWords = previousQuery.split(SPLIT_WORDS_REGEX);
  const newQueryWords = newQuery.split(SPLIT_WORDS_REGEX);
  return (
    !previousQueryWords.every(previousQueryWord =>
      newQueryWords.some(
        newQueryWord =>
          newQueryWord.includes(previousQueryWord) || previousQueryWord.includes(newQueryWord)
      )
    ) ||
    (isNewQueryEmpty && !isPreviousQueryEmpty) ||
    (!isNewQueryEmpty && isPreviousQueryEmpty)
  );
}
