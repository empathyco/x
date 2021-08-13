import { ModelNameType, Suggestion } from '@empathyco/x-types';

/**
 * Creates {@link @empathyco/x-types#Suggestion | suggestions} stub.
 *
 * @param modelName - Model name for each suggestion.
 * @param amount - Number of stubbed suggestions to create.
 *
 * @returns Array of suggestions stub.
 *
 * @internal
 */
export function getSuggestionsStub(modelName: ModelNameType, amount = 3): Suggestion[] {
  return Array.from<number, Suggestion>({ length: amount }, (_, index) =>
    createSuggestionStub(`Query ${index + 1}`, modelName)
  );
}

/**
 * Creates a suggestion stub with the provided options. If the name is the only property provided,
 * it will be used to generate the facets, query, totalResults, results and modelName.
 *
 * @param query - The query of the suggestion.
 * @param modelName - Model name for each suggestion.
 * @param suggestion - An optional object with fields to override the suggestion.
 *
 * @returns A suggestion.
 */
export function createSuggestionStub(query: string, modelName?: ModelNameType, suggestion?: Partial<Suggestion>): Suggestion {
  return {
    facets: [],
    key: 'key',
    query,
    totalResults: 10,
    results: [],
    modelName: modelName,
    ...suggestion
  };
}
