import type { ExtraParamsRequest, FilterableRequest, TrackableRequest } from '../request.model'

/**
 * Request for the suggestions-search endpoint.
 * @public
 */
export interface AiSuggestionsSearchRequest
  extends ExtraParamsRequest,
    TrackableRequest,
    FilterableRequest {
  queries: {
    query: string
    categories: string[]
  }[]
}
