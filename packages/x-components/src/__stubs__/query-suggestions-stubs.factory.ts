import { Facet, ModelNameType, Suggestion } from '@empathy/search-types';

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
