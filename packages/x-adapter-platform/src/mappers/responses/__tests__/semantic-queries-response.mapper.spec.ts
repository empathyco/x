 
import type { PlatformSemanticQueriesResponse } from '../../../types/responses/semantic-queries-response.model';
import { semanticQueriesResponseMapper } from '../semantic-queries-response.mapper';

describe('semanticQueriesResponseMapper tests', () => {
  it('should map the response', () => {
    const platformResponse: PlatformSemanticQueriesResponse = {
      data: {
        candidates: [
          {
            query: 'test 1',
            distance: 0.34996169805526733
          },
          {
            query: 'test 2',
            distance: 0.33996169805526733
          }
        ]
      }
    };

    expect(semanticQueriesResponseMapper(platformResponse, {})).toStrictEqual({
      semanticQueries: [
        {
          modelName: 'SemanticQuery',
          query: 'test 1',
          distance: 0.34996169805526733
        },
        {
          modelName: 'SemanticQuery',
          query: 'test 2',
          distance: 0.33996169805526733
        }
      ]
    });
  });
});
