import type { NextQueriesResponse } from '@empathyco/x-types'
import type { PlatformNextQueriesResponse } from '../../types/responses/next-queries-response.model'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { nextQueriesResponseSchema } from '../../schemas/responses'

/**
 * Default implementation for the NextQueriesResponseMapper.
 *
 * @public
 */
export const nextQueriesResponseMapper = zSchemaMapperFactory<
  PlatformNextQueriesResponse,
  NextQueriesResponse
>(nextQueriesResponseSchema)
