import type { ExtraParamsRequest } from '../request.model'

/**
 * Query object for each query in the request.
 *
 * @public
 */
export interface AiSuggestionsSearchRequestQuery {
  query: string
  categories: string[]
}
/**
 * Request for the suggestions search endpoint.
 *
 * @public
 */
export interface AiSuggestionsSearchRequest extends ExtraParamsRequest {
  lang: string
  queries: AiSuggestionsSearchRequestQuery[]
}
