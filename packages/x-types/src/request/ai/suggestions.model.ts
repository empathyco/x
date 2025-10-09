import type { ExtraParamsRequest, FilterableRequest, TrackableRequest } from '../request.model'

/**
 * Request for the ai suggestions endpoint.
 *
 * @public
 */
export interface AiSuggestionsRequest
  extends ExtraParamsRequest,
    TrackableRequest,
    FilterableRequest {
  query?: string
}
