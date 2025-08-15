import type { ExtraParamsRequest } from '../request.model'

export interface AIQuestionsRequest extends ExtraParamsRequest {
  query?: string
  lang: string
  extraParams: {
    instance?: string
    filters?: Record<string, unknown>
  }
}
