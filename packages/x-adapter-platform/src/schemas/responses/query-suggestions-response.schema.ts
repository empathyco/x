import type { QuerySuggestionsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { suggestionSchema } from '../models/suggestion.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the QuerySuggestionsResponseSchema.
 *
 * @public
 */
export const querySuggestionsResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    topTrends: z.optional(z.looseObject({ content: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): QuerySuggestionsResponse =>
    defined<QuerySuggestionsResponse>({
      suggestions: parseEach(suggestionSchema, source.topTrends?.content, context),
    }),
})
