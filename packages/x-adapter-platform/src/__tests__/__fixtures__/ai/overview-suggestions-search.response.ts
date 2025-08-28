import type { AiOverviewSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiOverviewSuggestionsSearchResponse } from '../../../types'
import { platformResult, result } from '../result.response'

export const platformAiOverviewSuggestionsSearchResponse: PlatformAiOverviewSuggestionsSearchResponse =
  {
    items: [
      { query: 'test', results: [platformResult] },
      { query: 'test2', results: [platformResult] },
    ],
  }

export const aiOverviewSuggestionsSearchResponse: AiOverviewSuggestionsSearchResponse = {
  items: [
    { query: 'test', results: [result] },
    { query: 'test2', results: [result] },
  ],
}
