import type { AiQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAiQuestionsResponse } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { AiQuestionsResponseSchema } from '../../../schemas'

/**
 * Default implementation for the PopularSearchesResponseMapper.
 *
 * @public
 */
export const AiQuestionsResponseMapper = schemaMapperFactory<
  PlatformAiQuestionsResponse,
  AiQuestionsResponse
>(AiQuestionsResponseSchema)
