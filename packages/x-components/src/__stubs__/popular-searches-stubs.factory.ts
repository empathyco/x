import { Suggestion } from '@empathyco/x-types';

/**
 * Creates a popular search stub with the provided options.
 *
 * @param query - The query of the suggestion.
 * @param suggestion - An optional object with fields to override the suggestion.
 *
 * @returns A suggestion.
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
