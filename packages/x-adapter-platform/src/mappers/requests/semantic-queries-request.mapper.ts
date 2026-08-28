import type { SemanticQueriesRequest } from '@empathyco/x-types'
import type { PlatformSemanticQueriesRequest } from '../../types'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { semanticQueriesRequestSchema } from '../../schemas/requests/semantic-queries-request.schema'

/**
 * Default implementation for the SemanticQueriesRequestMapper
 *
 * @public
 */
export const semanticQueriesRequestMapper = zSchemaMapperFactory<
  SemanticQueriesRequest,
  PlatformSemanticQueriesRequest
>(semanticQueriesRequestSchema)
