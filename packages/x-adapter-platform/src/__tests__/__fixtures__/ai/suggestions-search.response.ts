import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { platformResult, result } from '../result'

export const platformAiSuggestionsSearchResponse: PlatformAiSuggestionsSearchResponse = {
  items: [
    { query: 'test', results: [platformResult] },
    { query: 'test2', results: [platformResult] },
  ],
}

export const aiSuggestionsSearchResponse: AiSuggestionsSearchResponse = {
  suggestions: [
    { query: 'test', results: [result] },
    { query: 'test2', results: [result] },
  ],
}
