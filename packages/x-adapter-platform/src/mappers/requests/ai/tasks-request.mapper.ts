import type { AiTasksRequest } from '@empathyco/x-types'
import type { PlatformAiTasksRequest } from '../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { aiTasksRequestSchema } from '../../../schemas'

/**
 * Default implementation for the AiTasksRequestMapper.
 *
 * @public
 */
export const aiTasksRequestMapper = schemaMapperFactory<AiTasksRequest, PlatformAiTasksRequest>(
  aiTasksRequestSchema,
)
