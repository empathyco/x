import type { NextQueriesResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { nextQuerySchema } from '../models/next-query.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the NextQueriesResponseSchema.
 *
 * @public
 */
export const nextQueriesResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    data: z.optional(z.looseObject({ nextqueries: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): NextQueriesResponse =>
    defined<NextQueriesResponse>({
      nextQueries: parseEach(nextQuerySchema, source.data?.nextqueries, context),
    }),
})
