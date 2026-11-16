import type { PopularSearchesResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { suggestionSchema } from '../models/suggestion.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the PopularSearchesResponseSchema.
 *
 * @public
 */
export const popularSearchesResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    topTrends: z.optional(z.looseObject({ content: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): PopularSearchesResponse =>
    defined<PopularSearchesResponse>({
      suggestions: parseEach(suggestionSchema, source.topTrends?.content, context),
    }),
})
