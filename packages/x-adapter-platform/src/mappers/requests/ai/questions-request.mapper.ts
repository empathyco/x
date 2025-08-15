import type { AIQuestionsRequest } from '@empathyco/x-types'
import type { PlatformAIQuestionsRequest } from '../../../types/requests'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { AIQuestionsRequestSchema } from '../../../schemas/requests'

/**
 * Default implementation for the AIQuestionsRequestMapper.
 *
 * @public
 */
export const AIQuestionsRequestMapper = schemaMapperFactory<
  AIQuestionsRequest,
  PlatformAIQuestionsRequest
>(AIQuestionsRequestSchema)
