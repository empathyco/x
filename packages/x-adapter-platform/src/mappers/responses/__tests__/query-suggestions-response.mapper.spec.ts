import type { PlatformQuerySuggestionsResponse } from '../../../types/responses/query-suggestions-response.model'
import { querySuggestionsResponseMapper } from '../query-suggestions-response.mapper'

describe('querySuggestionsResponseMapper tests', () => {
  it('should map the response', () => {
    const platformQuerySuggestionsResponse: PlatformQuerySuggestionsResponse = {
      topTrends: {
        content: [{ keywords: 'sandal' }, { keywords: 'sock' }, { keywords: 'saree' }],
      },
    }

    expect(
      querySuggestionsResponseMapper(platformQuerySuggestionsResponse, {
        requestParameters: { query: 'shoes' },
      }),
    ).toStrictEqual({
      suggestions: [
        {
          query: 'sandal',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'sandal',
        },
        {
          query: 'sock',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'sock',
        },
        {
          query: 'saree',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'saree',
        },
      ],
    })
  })
})
