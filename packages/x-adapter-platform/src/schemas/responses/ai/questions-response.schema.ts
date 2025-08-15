import type { AIQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAIQuestionsResponse } from '../../../types/responses'
import { createMutableSchema } from '@empathyco/x-adapter'
import { AIQuestionsSchema } from '../../models/ai/questions.schema'

/**
 * Default implementation for the AIQuestionsResponseSchema.
 *
 * @public
 */
// eslint-disable-next-line ts/no-unsafe-assignment
export const AIQuestionsResponseSchema = createMutableSchema<
  PlatformAIQuestionsResponse,
  AIQuestionsResponse
>(AIQuestionsSchema)
