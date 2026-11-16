import type { RecommendationsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { resultSchema } from '../models/result.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the RecommendationsResponseSchema.
 *
 * @public
 */
export const recommendationsResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    topclicked: z.optional(z.looseObject({ content: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): RecommendationsResponse =>
    defined<RecommendationsResponse>({
      results: parseEach(resultSchema, source.topclicked?.content, context),
    }),
})
