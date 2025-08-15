import type { AIQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAIQuestionsResponse } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the AIQuestionsSchema.
 *
 * @public
 */
export const AIQuestionsSchema = createMutableSchema<
  PlatformAIQuestionsResponse,
  AIQuestionsResponse
>({
  context: 'context',
  items: 'items',
  taskId: 'taskId',
  numItems: 'numItems',
  totalItems: 'totalItems',
  resolved: 'resolved',
})
