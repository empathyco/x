import type { ExtraParamsRequest } from '../request.model'

/**
 * Request for the ai suggestions endpoint.
 *
 * @public
 */
export interface AiSuggestionsRequest extends ExtraParamsRequest {
  query?: string
}
