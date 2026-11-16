import type { NextQueriesResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { nextQuerySchema } from '../models/next-query.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the NextQueriesResponseSchema.
 *
 * @public
 */
export const nextQueriesResponseSchema = createMutableZodSchema<
  PlatformListResponseSource<'data', 'nextqueries'>,
  NextQueriesResponse
>({
  transform: (source, context): NextQueriesResponse =>
    defined<NextQueriesResponse>({
      nextQueries: parseEach(nextQuerySchema, source.data?.nextqueries, context),
    }),
})
