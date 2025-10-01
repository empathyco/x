import type { ExtraParamsRequest, TrackableRequest } from '../request.model'

/**
 * Request for the suggestions-search endpoint.
 * @public
 */
export interface AiSuggestionsSearchRequest extends ExtraParamsRequest, TrackableRequest {
  queries: {
    query: string
    categories: string[]
  }[]
}
