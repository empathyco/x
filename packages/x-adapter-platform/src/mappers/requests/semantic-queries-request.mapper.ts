import type { SemanticQueriesRequest } from '@empathyco/x-types'
import type { PlatformSemanticQueriesRequest } from '../../types'

import { transformSchemaMapperFactory } from '@empathyco/x-adapter'
import { semanticQueriesRequestSchema } from '../../schemas/requests/semantic-queries-request.schema'

/**.
 * Default implementation for the SemanticQueriesRequestMapper
 *
 * @public
 */
export const semanticQueriesRequestMapper = transformSchemaMapperFactory<
  SemanticQueriesRequest,
  PlatformSemanticQueriesRequest
>(semanticQueriesRequestSchema)
