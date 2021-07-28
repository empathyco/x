import { ModelNameType, Suggestion } from '@empathyco/x-types-old';
import { createFacetWithFilter } from './facets-stubs.factory';

/**
 * Function to create query suggestions stub with facets with the modelName and query search
 * passes as parameter.
 *
 * @param modelName - Model name for each suggestion.
 * @param query - Query search of current state.
 *
 * @returns Array of suggestion stub.
 */
export function getQuerySuggestionsStub(modelName: ModelNameType, query: string): Suggestion[] {
  return [
    {
      facets: [],
      query: `salt ${query}`,
      key: `salt ${query}`,
      modelName: modelName
    },
    {
      facets: [createFacetWithFilter('category01')],
      query: `${query}`,
      key: `${query}`,
      modelName: modelName
    },
    {
      facets: [],
      query: `${query}`,
      key: `${query}`,
      modelName: modelName
    },
    {
      facets: [],
      query: `${query}`,
      key: `${query}`,
      modelName: modelName
    },
    {
      facets: [],
      query: `bë&éf shórt ribs ${query}`,
      key: `beef short ribs ${query}`,
      modelName: modelName
    }
  ];
}
