import type { AiSuggestionSearch } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { defined, parseEach } from '../../utils'
import { resultSchema } from '../result.schema'

/**
 * Default implementation for the AiSuggestionSearchSchema.
 * @public
 */
export const aiSuggestionSearchSchema = createMutableZodSchema({
  source: z.looseObject({
    query: z.string(),
    results: z.optional(z.array(z.unknown())),
    numFound: z.optional(z.number()),
  }),
  transform: (source, context): AiSuggestionSearch =>
    defined<AiSuggestionSearch>({
      query: source.query,
      results: parseEach(resultSchema, source.results, context),
      numFound: source.numFound,
    }),
})
