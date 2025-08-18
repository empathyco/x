import type { ExtraParamsRequest } from '../request.model'

export interface AiQuestionsRequest extends ExtraParamsRequest {
  query?: string
  lang: string
  extraParams: {
    instance?: string
    filters?: Record<string, unknown>
  }
}
