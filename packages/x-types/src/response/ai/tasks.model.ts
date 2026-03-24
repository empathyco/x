import type { AiQuestionsResponse } from './questions.model'

/**
 * Model for each step of the empathising task.
 *
 * @public
 */
export interface StepEmpathising {
  stepName: string
  stepDescription: string
}

/**
 * Response for the task endpoint.
 *
 * @public
 */
export interface AiTasksResponse {
  result: AiQuestionsResponse
  steps: StepEmpathising[]
}
