import type { SemanticQueriesRequest } from '@empathyco/x-types'
import type { PlatformSemanticQueriesRequest } from '../../types'

import { schemaMapperFactory } from '@empathyco/x-adapter'
import { semanticQueriesRequestSchema } from '../../schemas/requests/semantic-queries-request.schema'

/**.
 * Default implementation for the SemanticQueriesRequestMapper
 *
 * @public
 */
export const semanticQueriesRequestMapper = schemaMapperFactory<
  SemanticQueriesRequest,
  PlatformSemanticQueriesRequest
>(semanticQueriesRequestSchema)
