import type { AiQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAiQuestionsResponse } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the AIQuestionsSchema.
 *
 * @public
 */
export const AiQuestionsSchema = createMutableSchema<
  PlatformAiQuestionsResponse,
  AiQuestionsResponse
>({
  context: 'context',
  items: 'items',
  taskId: 'taskId',
  numItems: 'numItems',
  totalItems: 'totalItems',
  resolved: 'resolved',
})
