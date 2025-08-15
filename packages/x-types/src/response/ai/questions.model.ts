import type { AIQuestion } from '../../ai/question.model'

export interface AIQuestionsResponse {
  context: {
    query?: string
    lang: string
    instance: string
    filters?: Record<string, unknown>
  }
  items: AIQuestion[]
  taskId: string
  numItems: number
  totalItems: number
  resolved: boolean
}
