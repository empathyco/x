import type { AiQuestion } from '../../ai/question.model'

export interface AiQuestionsResponse {
  context: {
    query?: string
    lang: string
    instance: string
    filters?: Record<string, unknown>
  }
  items: AiQuestion[]
  taskId: string
  numItems: number
  totalItems: number
  resolved: boolean
}
