import type { ExtraParamsRequest } from '../request.model'

/**
 * Request for the question endpoint.
 *
 * @public
 */
export interface AiQuestionsRequest extends ExtraParamsRequest {
  query?: string
  lang: string
}
