import type { SemanticQueriesResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { semanticQuerySchema } from '../models/semantic-query.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the SemanticQueriesResponseSchema.
 *
 * @public
 */
export const semanticQueriesResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    data: z.optional(z.looseObject({ candidates: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): SemanticQueriesResponse =>
    defined<SemanticQueriesResponse>({
      semanticQueries: parseEach(semanticQuerySchema, source.data?.candidates, context),
    }),
})
