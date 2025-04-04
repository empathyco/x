import type { NextQueriesRequest } from '@empathyco/x-types'
import type { PlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model'

import { schemaMapperFactory } from '@empathyco/x-adapter'
import { nextQueriesRequestSchema } from '../../schemas/requests/next-queries-request.schema'

/**
 * Default implementation for the NextQueriesRequestMapper.
 *
 * @public
 */
export const nextQueriesRequestMapper = schemaMapperFactory<
  NextQueriesRequest,
  PlatformNextQueriesRequest
>(nextQueriesRequestSchema)
