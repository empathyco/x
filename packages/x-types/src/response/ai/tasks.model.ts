import type { AiQuestionsResponse } from './questions.model'

export interface StepEmpathising {
  stepName: string
  stepDescription: string
}

export interface AiTasksResponse {
  result: AiQuestionsResponse
  steps: StepEmpathising[]
}
