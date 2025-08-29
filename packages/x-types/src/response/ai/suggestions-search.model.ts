import type { Result } from '../../result/result.model'

/**
 * Response for the AI suggestions search endpoint.
 *
 * @public
 */
export interface AiSuggestionsSearchResponse {
  items: { query: string; results: Result[] }[]
}
