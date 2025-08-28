/**
 * Response for the overview suggestions search endpoint.
 *
 * @public
 */
export interface AiOverviewSuggestionsSearchResponse {
  items: { query: string; results: any[] }[]
}
