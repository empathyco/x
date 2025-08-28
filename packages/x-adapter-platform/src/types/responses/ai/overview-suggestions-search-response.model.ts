import type { PlatformResult } from '../../models/result.model'

/**
 * Response for the `overview suggestions search` endpoint.
 *
 * @public
 */
export interface PlatformAiOverviewSuggestionsSearchResponse {
  items: { query: string; results: PlatformResult[] }[]
}
