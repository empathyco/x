import { ModelNameType, Suggestion } from '@empathyco/x-types';
import { createFacetWithFilter } from './facets-stubs.factory';

/**
 * Function to create suggestions stub with the modelName passes as parameter.
 *
 * @param modelName - Model name for each suggestion.
 * @returns Array of suggestion stub.
 */
export function getSuggestionsStub(modelName: ModelNameType): Suggestion[] {
  return [
    {
      facets: [],
      query: 'salt',
      key: 'salt',
      modelName: modelName
    },
    {
      facets: [],
      query: 'limes',
      key: 'limes',
      modelName: modelName
    },
    {
      facets: [createFacetWithFilter('fruit')],
      query: 'limes',
      key: 'limes',
      modelName: modelName
    },
    {
      facets: [createFacetWithFilter('fresh')],
      query: 'limes',
      key: 'limes',
      modelName: modelName
    },
    {
      facets: [],
      query: 'beef short ribs',
      key: 'beef short ribs',
      modelName: modelName
    }
  ];
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
    modelName: 'QuerySuggestion',
    ...suggestion
  };
}
