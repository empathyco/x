import type {
  ExtraParamsRequest,
  FilterableRequest,
  QueryableRequest,
  TrackableRequest,
} from '../request.model'

/**
 * Request for the ai suggestions endpoint.
 *
 * @public
 */
export interface AiSuggestionsRequest
  extends ExtraParamsRequest,
    TrackableRequest,
    FilterableRequest,
    QueryableRequest {}
