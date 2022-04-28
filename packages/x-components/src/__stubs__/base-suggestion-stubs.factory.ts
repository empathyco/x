import { BooleanFilter, Suggestion } from '@empathyco/x-types';

/**
 * Creates a base suggestion with facets.
 *
 * @param query - Sets a query to test.
 * @param key - Sets suggestion key.
 * @param modelName - Sets suggestion modelName.
 * @returns A base suggestion with facets.
 *
 * @internal
 */
export function createBaseSuggestionWithFacets(
  query: string,
  key: string,
  modelName: string | any
): Suggestion {
  return {
    facets: [
      {
        id: 'rootCategories',
        label: 'rootCategories',
        modelName: 'SimpleFacet',
        filters: <Array<BooleanFilter>>[
          {
            facetId: 'rootCategories',
            id: '{!tag=rootFilter}rootCategories_60361120_64009600:"DORMIR"',
            label: 'DORMIR',
            selected: false,
            totalResults: 60,
            modelName: 'SimpleFilter'
          },
          {
            facetId: 'rootCategories',
            id: '{!tag=rootFilter}rootCategories_60361120_64009600:"SPECIAL PRICES"',
            label: 'SPECIAL PRICES',
            selected: false,
            totalResults: 24,
            modelName: 'SimpleFilter'
          }
        ]
      },
      {
        id: 'exampleFacet',
        label: 'exampleFacet',
        modelName: 'SimpleFacet',
        filters: <Array<BooleanFilter>>[
          {
            facetId: 'exampleFacet',
            id: '{!tag=exampleFacet}exampleFacet_60361120_64009600:"EXAMPLE"',
            label: 'EXAMPLE',
            selected: false,
            totalResults: 60,
            modelName: 'SimpleFilter'
          }
        ]
      }
    ],
    key: key,
    query: query,
    totalResults: 10,
    results: [],
    modelName: modelName
  };
}
