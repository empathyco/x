import type { AiQuestionsRequest } from '@empathyco/x-types'
import type { PlatformAiQuestionsRequest } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiQuestionsRequestSchema } from '../../../schemas'

/**
 * Default implementation for the AIQuestionsRequestMapper.
 *
 * @public
 */
export const aiQuestionsRequestMapper = schemaMapperFactory<
  AiQuestionsRequest,
  PlatformAiQuestionsRequest
>(aiQuestionsRequestSchema)
