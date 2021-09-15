import { Suggestion } from '@empathyco/x-types';
import { createFacetWithFilter } from './facets-stubs.factory';

/**
 * Function to create suggestions stub with the modelName passes as parameter.
 *
 * @param modelName - Model name for each suggestion.
 * @returns Array of suggestion stub.
 */
export function getSuggestionsStub(modelName: Suggestion['modelName']): Suggestion[] {
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
