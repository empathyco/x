import type { AiQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAiQuestionsResponse } from '../../../types/responses'
import { createMutableSchema } from '@empathyco/x-adapter'
import { aiQuestionsSchema } from '../../models/ai/questions.schema'

/**
 * Default implementation for the AIQuestionsResponseSchema.
 *
 * @public
 */

export const aiQuestionsResponseSchema = createMutableSchema<
  PlatformAiQuestionsResponse,
  AiQuestionsResponse
>(aiQuestionsSchema)
