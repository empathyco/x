import { PlatformNextQueriesResponse } from '../../../types/responses/next-queries-response.model';
import { nextQueriesResponseMapper } from '../next-queries-response.mapper';

describe('nextQueriesResponseMapper tests', () => {
  it('should map the response', () => {
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
