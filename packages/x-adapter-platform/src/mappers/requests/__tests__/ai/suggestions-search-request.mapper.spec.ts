import type { AiSuggestionsSearchRequest } from '@empathyco/x-types'
import { aiSuggestionsSearchRequestMapper } from '../../ai/suggestions-search-request.mapper'

describe('aiSuggestionsSearchRequestMapper tests', () => {
  it('should map the request', () => {
    const request: AiSuggestionsSearchRequest = {
      lang: 'es',
      queries: [],
      extraParams: {
        instance: 'empathy',
        env: 'test',
      },
    }

    expect(aiSuggestionsSearchRequestMapper(request, {})).toStrictEqual({
      queries: [],
      context: {
        instance: 'empathy',
        lang: 'es',
      },
    })
  })
})
