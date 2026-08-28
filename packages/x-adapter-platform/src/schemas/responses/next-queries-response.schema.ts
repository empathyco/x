import type { NextQueriesResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { nextQuerySchema } from '../models/next-query.schema'

/**
 * Default implementation for the NextQueriesResponseSchema.
 *
 * @public
 */
export const nextQueriesResponseSchema = z
  .object({
    data: z
      .object({
        nextqueries: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): NextQueriesResponse => ({
      nextQueries: source.data?.nextqueries?.map(item => nextQuerySchema.parse(item)) ?? [],
    }),
  )
