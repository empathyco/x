import type { ExtraParamsRequest } from '../request.model'

/**
 * Request for the suggestions-search endpoint.
 * @public
 */
export interface AiSuggestionsSearchRequest extends ExtraParamsRequest {
  queries: {
    query: string
    categories: string[]
  }[]
}
