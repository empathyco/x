import { Suggestion } from '@empathyco/x-types';

/**
 * Creates a list of generic query suggestions for the given query.
 *
 * @param query - The query the suggestions belong to.
 * @param amount - The number of query suggestions to create.
 *
 * @returns An array of query suggestions.
 */
export function getQuerySuggestionsStub(query: string, amount = 3): Suggestion[] {
  return Array.from({ length: amount }, (_, index) =>
    createQuerySuggestion(`${query} suggestion ${index}`)
  );
}

/**
 * Creates a query suggestion stub with the provided options.
 *
 * @param query - The query of the suggestion.
 * @param suggestion - An optional object with fields to override the suggestion.
 *
 * @returns A query suggestion.
 */
export function createQuerySuggestion(query: string, suggestion?: Partial<Suggestion>): Suggestion {
  return {
    facets: [],
    key: query,
    query,
    totalResults: 10,
    results: [],
    modelName: 'QuerySuggestion',
    ...suggestion
  };
}
