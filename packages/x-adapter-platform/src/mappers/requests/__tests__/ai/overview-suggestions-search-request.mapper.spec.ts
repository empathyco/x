import type { AiOverviewSuggestionsSearchRequest } from '@empathyco/x-types'
import { aiOverviewSuggestionsSearchRequestMapper } from '../../ai/overview-suggestions-search-request.mapper'

describe('overviewSuggestionsSearchRequestMapper tests', () => {
  it('should map the request', () => {
    const request: AiOverviewSuggestionsSearchRequest = {
      lang: 'es',
      queries: [],
      extraParams: {
        instance: 'empathy',
        env: 'test',
      },
    }

    expect(aiOverviewSuggestionsSearchRequestMapper(request, {})).toStrictEqual({
      queries: [],
      context: {
        instance: 'empathy',
        lang: 'es',
      },
    })
  })
})
