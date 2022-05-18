import { querySuggestionsResponseMapper } from '../query-suggestions-response.mapper';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsResponse } from '../../../types/responses/query-suggestions-response.model';

describe('querySuggestionsResponseMapper tests', () => {
  it('should map the response', () => {
    const platformQuerySuggestionsResponse: PlatformQuerySuggestionsResponse = {
      topTrends: {
        content: [{ title_raw: 'sandal' }, { title_raw: 'sock' }, { title_raw: 'saree' }]
      }
    };

    expect(
      querySuggestionsResponseMapper(platformQuerySuggestionsResponse, {
        requestParameters: { query: 'shoes' }
      })
    ).toStrictEqual({
      suggestions: [
        {
          query: 'sandal',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'sandal'
        },
        {
          query: 'sock',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'sock'
        },
        {
          query: 'saree',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'saree'
        }
      ]
    });
  });
});
