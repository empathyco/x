import type { SemanticQueriesResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { semanticQuerySchema } from '../models/semantic-query.schema'

/**
 * Default implementation for the SemanticQueriesResponseSchema.
 *
 * @public
 */
export const semanticQueriesResponseSchema = z
  .object({
    data: z
      .object({
        candidates: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): SemanticQueriesResponse => ({
      semanticQueries: source.data?.candidates?.map(item => semanticQuerySchema.parse(item)) ?? [],
    }),
  )
