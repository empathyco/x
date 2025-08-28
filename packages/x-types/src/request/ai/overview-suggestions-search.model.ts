import type { ExtraParamsRequest } from '../request.model'

/**
 * Query object for each query in the request.
 *
 * @public
 */
export interface AiOverviewSuggestionsSearchRequestQuery {
  query: string
  categories: string[]
}
/**
 * Request for the question endpoint.
 *
 * @public
 */
export interface AiOverviewSuggestionsSearchRequest extends ExtraParamsRequest {
  lang: string
  queries: AiOverviewSuggestionsSearchRequestQuery[]
}
