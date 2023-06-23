import { popularSearchesResponseMapper } from '../popular-searches-response.mapper';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesResponse } from '../../../types/responses/popular-searches-response.model';

describe('popularSearchesResponseMapper tests', () => {
  it('should map the response', () => {
    const platformPopularSearchesResponse: PlatformPopularSearchesResponse = {
      topTrends: {
        content: [{ keywords: 'sandal' }, { keywords: 'sock' }, { keywords: 'saree' }]
      }
    };

    expect(popularSearchesResponseMapper(platformPopularSearchesResponse, {})).toStrictEqual({
      suggestions: [
        {
          query: 'sandal',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'sandal'
        },
        {
          query: 'sock',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'sock'
        },
        {
          query: 'saree',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'saree'
        }
      ]
    });
  });
});
