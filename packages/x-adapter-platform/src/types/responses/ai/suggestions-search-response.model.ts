import type { PlatformResult } from '../../models/result.model'

/**
 * Response for the `AI suggestions search` endpoint.
 *
 * @public
 */
export interface PlatformAiSuggestionsSearchResponse {
  items: {
    query: string
    results: PlatformResult[]
    numFound: number
  }[]
}
