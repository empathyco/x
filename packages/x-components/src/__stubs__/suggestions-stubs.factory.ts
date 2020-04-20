import { Facet, ModelNameType, Suggestion } from '@empathy/search-types';

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
 * Function to create a single facet with one filter.
 *
 * @param category - Category to be used in the filter creation.
 * @returns Facet with the filter added.
 */
export function createFacetWithFilter(category: string): Facet {
  const facet: Facet = {
    modelName: 'Facet',
    filters: [],
    title: 'category'
  };

  facet.filters.push({
    modelName: 'Filter',
    id: `category:${category}`,
    callbackInfo: {},
    children: [],
    count: 10,
    parent: null,
    selected: false,
    title: category,
    value: {
      filter: `category:${category}`
    },
    facet
  });

  return facet;
}
