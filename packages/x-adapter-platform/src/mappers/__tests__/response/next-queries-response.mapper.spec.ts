import { PlatformNextQueriesResponse } from '../../../types/response.types';
import { nextQueriesResponseMapper } from '../../responses/next-queries-response.mapper';

describe('next queries response mapper', () => {
  it('should map the next queries', () => {
    const platformNextQueriesResponse: PlatformNextQueriesResponse = {
      data: {
        nextqueries: [
          {
            query: 'makeup remover',
            source: 'ORGANIC',
            position: 1000
          },
          {
            query: 'shoes',
            position: 1000,
            source: 'CURATED'
          }
        ]
      }
    };

    expect(nextQueriesResponseMapper(platformNextQueriesResponse, {})).toStrictEqual({
      nextQueries: [
        {
          query: 'makeup remover',
          results: [],
          facets: [],
          modelName: 'NextQuery',
          totalResults: 0,
          isCurated: false
        },
        {
          query: 'shoes',
          results: [],
          facets: [],
          modelName: 'NextQuery',
          totalResults: 0,
          isCurated: true
        }
      ]
    });
  });
});
