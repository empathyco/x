import { Suggestion } from '@empathyco/x-types';
import { createFacetWithFilter } from './facets-stubs.factory';

/**
 * Function to create query suggestions stub with facets with the modelName and query search
 * passes as parameter.
 *
 * @param query - Query search of current state.
 *
 * @returns Array of suggestion stub.
 */
export function getQuerySuggestionsStub(query: string): Suggestion[] {
  return [
    {
      facets: [],
      query: `salt ${query}`,
      key: `salt ${query}`,
      modelName: 'QuerySuggestion'
    },
    {
      facets: [createFacetWithFilter('category01')],
      query: `${query}`,
      key: `${query}`,
      modelName: 'QuerySuggestion'
    },
    {
      facets: [],
      query: `${query}`,
      key: `${query}`,
      modelName: 'QuerySuggestion'
    },
    {
      facets: [],
      query: `bë&éf shórt ribs ${query}`,
      key: `beef short ribs ${query}`,
      modelName: 'QuerySuggestion'
    }
  ];
}
