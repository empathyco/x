import type { AiTasksRequest } from '@empathyco/x-types'
import type { PlatformAiTasksRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the AiTasksRequestSchema.
 *
 * @public
 */
export const aiTasksRequestSchema = createMutableSchema<AiTasksRequest, PlatformAiTasksRequest>({
  taskId: 'taskId',
})
