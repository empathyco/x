import type { AiTasksResponse } from '@empathyco/x-types'
import type { PlatformAiTasksResponse } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'
import { aiQuestionsSchema } from './questions.schema'

/**
 * Default implementation for the AITasksSchema.
 *
 * @public
 */
export const aiTasksSchema = createMutableSchema<PlatformAiTasksResponse, AiTasksResponse>({
  result: {
    $path: 'result',
    $subSchema: aiQuestionsSchema,
  },
  steps: 'steps',
})
