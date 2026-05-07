import type { Result } from '@empathyco/x-types'

/**
 * Request for the `AI suggestions search` endpoint.
 *
 * @public
 */
export interface PlatformAiSuggestionsSearchRequest {
  context: {
    lang: string
    instance?: string
    filters?: Record<string, unknown>
  }
  queries: {
    query: string
    categories: string[]
  }[]
  excludeOptions: {
    resultIds: Result['id'][]
  }
}
