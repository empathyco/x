import type { AiQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAiQuestionsResponse } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiQuestionsResponseSchema } from '../../../schemas'

/**
 * Default implementation for the AiQuestionsResponseMapper.
 *
 * @public
 */
export const aiQuestionsResponseMapper = schemaMapperFactory<
  PlatformAiQuestionsResponse,
  AiQuestionsResponse
>(aiQuestionsResponseSchema)
