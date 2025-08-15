import type { AIQuestionsResponse } from '@empathyco/x-types'
import type { PlatformAIQuestionsResponse } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { AIQuestionsResponseSchema } from '../../../schemas'

/**
 * Default implementation for the PopularSearchesResponseMapper.
 *
 * @public
 */
export const AIQuestionsResponseMapper = schemaMapperFactory<
  PlatformAIQuestionsResponse,
  AIQuestionsResponse
>(AIQuestionsResponseSchema)
