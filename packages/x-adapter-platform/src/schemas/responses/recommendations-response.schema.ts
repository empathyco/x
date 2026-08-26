import type { RecommendationsResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { resultSchema } from '../models/result.schema'

/**
 * Default implementation for the RecommendationsResponseSchema.
 *
 * @public
 */
export const recommendationsResponseSchema = z
  .object({
    topclicked: z
      .object({
        content: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): RecommendationsResponse => ({
      results: source.topclicked?.content?.map(item => resultSchema.parse(item)) ?? [],
    }),
  )
