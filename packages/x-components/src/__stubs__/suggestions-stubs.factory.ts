import { ModelNameType, Suggestion } from '@empathyco/x-types';
import { createFacetWithFilter } from './facets-stubs.factory';

/**
 * Creates {@link @empathyco/x-types#Suggestion | suggestions} stub.
 *
 * @param amount - Number of stubbed suggestions to create.
 *
 * @returns Array of suggestions stub.
 *
 * @internal
 */
export function getSuggestionsStub(amount = 3): Suggestion[] {
  return Array.from<number, Suggestion>({ length: amount }, (_, index) =>
    createSuggestionStub(`Suggestions ${index + 1}`)
  );
}

/**
 * Creates a suggestion stub with the provided options. If the name is the only property provided,
 * it will be used to generate the facets, query, totalResults, results and modelName.
 *
 * @param query - The query of the suggestion.
 * @param suggestion - An optional object with fields to override the suggestion.
 *
 * @returns A suggestion.
 */
export function createSuggestionStub(query: string, suggestion?: Partial<Suggestion>): Suggestion {
  return {
    facets: [],
    key: 'key',
    query,
    totalResults: 10,
    results: [],
    modelName: 'Suggestion',
    ...suggestion
  };
}
