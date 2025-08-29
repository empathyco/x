import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { platformResult, result } from '../result.response'

export const platformAiSuggestionsSearchResponse: PlatformAiSuggestionsSearchResponse = {
  items: [
    { query: 'test', results: [platformResult] },
    { query: 'test2', results: [platformResult] },
  ],
}

export const aiSuggestionsSearchResponse: AiSuggestionsSearchResponse = {
  items: [
    { query: 'test', results: [result] },
    { query: 'test2', results: [result] },
  ],
}
