import type { AiTasksRequest } from '@empathyco/x-types'
import type { PlatformAiTasksRequest } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

export const aiTasksRequestSchema = createMutableSchema<AiTasksRequest, PlatformAiTasksRequest>({
  taskId: 'taskId',
})
