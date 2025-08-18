import type { AiQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAiQuestionsResponse } from '../../../types/responses'
import { createMutableSchema } from '@empathyco/x-adapter'
import { AiQuestionsSchema } from '../../models/ai/questions.schema'

/**
 * Default implementation for the AIQuestionsResponseSchema.
 *
 * @public
 */

export const AiQuestionsResponseSchema = createMutableSchema<
  PlatformAiQuestionsResponse,
  AiQuestionsResponse
>(AiQuestionsSchema)
