import type { AiTasksResponse } from '@empathyco/x-types'
import type { PlatformAiTasksResponse } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiTasksResponseSchema } from '../../../schemas'

/**
 * Default implementation for the AiTasksResponseMapper.
 *
 * @public
 */
export const aiTasksResponseMapper = schemaMapperFactory<PlatformAiTasksResponse, AiTasksResponse>(
  aiTasksResponseSchema,
)
