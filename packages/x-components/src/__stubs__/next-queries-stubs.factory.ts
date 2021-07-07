import { NextQuery } from '@empathyco/x-types';

/**
 * Function to create next queries stub with the modelName passes as parameter.
 *
 * @returns Array of next queries stub.
 */
export function getNextQueriesStub(): NextQuery[] {
  return [
    {
      facets: [],
      query: 'salt',
      totalResults: 10,
      results: [],
      modelName: 'NextQueries'
    },
    {
      facets: [],
      query: 'limes',
      totalResults: 8,
      results: [],
      modelName: 'NextQueries'
    },
    {
      facets: [],
      query: 'beef short ribs',
      totalResults: 5,
      results: [],
      modelName: 'NextQueries'
    }
  ];
}
