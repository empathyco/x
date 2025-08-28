/**
 * Request for the `Overview suggestions search` endpoint.
 *
 * @public
 */
export interface PlatformAiOverviewSuggestionsSearchRequest {
  context: {
    lang: string
    instance?: string
    filters?: Record<string, unknown>
  }
  queries: { query: string; categories: string[] }[]
}
