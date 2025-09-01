import {
  aiSuggestionsSearchResponse,
  platformAiSuggestionsSearchResponse,
} from '../../../../__tests__/__fixtures__/ai/suggestions-search.response'
import { aiSuggestionsSearchResponseMapper } from '../../ai/suggestions-search-response.mapper'

describe('overviewSuggestionsSearchResponseMapper tests', () => {
  it('should map the response', () => {
    expect(
      aiSuggestionsSearchResponseMapper(platformAiSuggestionsSearchResponse, {}),
    ).toStrictEqual(aiSuggestionsSearchResponse)
  })
})
