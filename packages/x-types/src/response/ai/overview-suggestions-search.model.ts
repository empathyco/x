import type { Result } from '../../result'

/**
 * Response for the overview suggestions search endpoint.
 *
 * @public
 */
export interface AiOverviewSuggestionsSearchResponse {
  items: { query: string; results: Result[] }[]
}
