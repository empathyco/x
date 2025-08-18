import type { AiQuestionsRequest } from '@empathyco/x-types'
import type { PlatformAiQuestionsRequest } from '../../../types/requests'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { AiQuestionsRequestSchema } from '../../../schemas/requests'

/**
 * Default implementation for the AIQuestionsRequestMapper.
 *
 * @public
 */
export const AiQuestionsRequestMapper = schemaMapperFactory<
  AiQuestionsRequest,
  PlatformAiQuestionsRequest
>(AiQuestionsRequestSchema)
