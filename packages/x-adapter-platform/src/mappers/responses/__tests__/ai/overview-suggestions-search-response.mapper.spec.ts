import {
  aiOverviewSuggestionsSearchResponse,
  platformAiOverviewSuggestionsSearchResponse,
} from '../../../../__tests__/__fixtures__/ai/overview-suggestions-search.response'
import { aiOverviewSuggestionsSearchResponseMapper } from '../../ai/overview-suggestions-search-response.mapper'

describe('overviewSuggestionsSearchResponseMapper tests', () => {
  it('should map the response', () => {
    expect(
      aiOverviewSuggestionsSearchResponseMapper(platformAiOverviewSuggestionsSearchResponse, {}),
    ).toStrictEqual(aiOverviewSuggestionsSearchResponse)
  })
})
