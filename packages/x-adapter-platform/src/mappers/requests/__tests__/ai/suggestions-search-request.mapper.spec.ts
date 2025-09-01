import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import { aiSuggestionsSearchRequestMapper } from '../../ai/suggestions-search-request.mapper'

describe('aiSuggestionsSearchRequestMapper tests', () => {
  it('should map the request', () => {
    const request: AiSuggestionsSearchRequest = {
      queries: [],
      extraParams: {
        lang: 'es',
        instance: 'empathy',
        env: 'test',
      },
    }

    expect(aiSuggestionsSearchRequestMapper(request, {})).toStrictEqual({
      queries: [],
      context: {
        lang: 'es',
        instance: 'empathy',
        filters: undefined,
      },
    })
  })
})
