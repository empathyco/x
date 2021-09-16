import { Suggestion } from '@empathyco/x-types';

/**
 * Creates a list of generic popular searches.
 *
 * @param amount - The number of popular searches to create.
 *
 * @returns An array of popular searches.
 */
export function getPopularSearchesStub(amount = 3): Suggestion[] {
  return Array.from({ length: amount }, (_, index) =>
    createPopularSearch(`Popular search ${index}`)
  );
}

/**
 * Creates a popular search stub with the provided options.
 *
 * @param query - The query of the suggestion.
 * @param suggestion - An optional object with fields to override the suggestion.
 *
 * @returns A popular search.
 */
export function createPopularSearch(query: string, suggestion?: Partial<Suggestion>): Suggestion {
  return {
    facets: [],
    key: query,
    query,
    totalResults: 10,
    results: [],
    modelName: 'PopularSearch',
    ...suggestion
  };
}
