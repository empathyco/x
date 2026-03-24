import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { platformResult, result } from '../result'

export const platformAiSuggestionsSearchResponse: PlatformAiSuggestionsSearchResponse = {
  items: [
    {
      query: 'test1',
      results: [platformResult],
      numFound: 10,
      tagging: {
        query: 'test1QueryTagging',
      },
    },
    {
      query: 'test2',
      results: [platformResult],
      numFound: 5,
      tagging: { query: 'test2QueryTagging' },
    },
  ],
}

export const aiSuggestionsSearchResponse: AiSuggestionsSearchResponse = {
  suggestions: [
    {
      query: 'test1',
      results: [result],
      numFound: 10,
      tagging: {
        query: { url: 'test1QueryTagging', params: { follow: false } },
      },
    },
    {
      query: 'test2',
      results: [result],
      numFound: 5,
      tagging: {
        query: { url: 'test2QueryTagging', params: { follow: false } },
      },
    },
  ],
}
