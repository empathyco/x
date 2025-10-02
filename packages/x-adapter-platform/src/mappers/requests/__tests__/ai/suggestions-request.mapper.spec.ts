import type { AiSuggestionsRequest } from '@empathyco/x-types'
import { aiSuggestionsRequestMapper } from '../../ai'

describe('aiSuggestionsRequestMapper', () => {
  it('should map the request correctly', () => {
    const request: AiSuggestionsRequest = {
      query: 'test',
      extraParams: {
        lang: 'es',
        instance: 'empathy',
        env: 'test',
      },
      origin: 'origin',
    }

    expect(aiSuggestionsRequestMapper(request, {})).toStrictEqual({
      context: {
        query: 'test',
        lang: 'es',
        instance: 'empathy',
        filters: { env: 'test', origin: 'origin' },
      },
    })
  })
})
