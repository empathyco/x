import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { platformResult, result } from '../result'

export const platformAiSuggestionsSearchResponse: PlatformAiSuggestionsSearchResponse = {
  items: [
    { query: 'test', results: [platformResult], numFound: 10 },
    { query: 'test2', results: [platformResult], numFound: 5 },
  ],
}

export const aiSuggestionsSearchResponse: AiSuggestionsSearchResponse = {
  suggestions: [
    { query: 'test', results: [result], numFound: 10 },
    { query: 'test2', results: [result], numFound: 5 },
  ],
}
