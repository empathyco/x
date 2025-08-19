import type { AiTasksResponse } from '@empathyco/x-types'
import type { PlatformAiTasksResponse } from '../../../types/responses'
import { createMutableSchema } from '@empathyco/x-adapter'
import { aiTasksSchema } from '../../models/ai/tasks.schema'

/**
 * Default implementation for the AITasksResponseSchema.
 *
 * @public
 */

export const aiTasksResponseSchema = createMutableSchema<PlatformAiTasksResponse, AiTasksResponse>(
  aiTasksSchema,
)
