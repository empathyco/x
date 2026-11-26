import type { NextQueriesResponse } from '@empathyco/x-types'
import type { PlatformNextQueriesResponse } from '../../types/responses/next-queries-response.model'
import { transformSchemaMapperFactory } from '@empathyco/x-adapter'
import { nextQueriesResponseSchema } from '../../schemas/responses'

/**
 * Default implementation for the NextQueriesResponseMapper.
 *
 * @public
 */
export const nextQueriesResponseMapper = transformSchemaMapperFactory<
  PlatformNextQueriesResponse,
  NextQueriesResponse
>(nextQueriesResponseSchema)
