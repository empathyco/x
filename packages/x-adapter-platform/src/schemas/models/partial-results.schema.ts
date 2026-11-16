import type { PartialResult } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { defined, parseEach } from '../utils'
import { resultSchema } from './result.schema'

/**
 * Default implementation for the PartialResultsSchema.
 *
 * @public
 */
export const partialResultsSchema = createMutableZodSchema({
  source: z.looseObject({
    term: z.string(),
    numFound: z.optional(z.number()),
    content: z.optional(z.array(z.unknown())),
  }),
  transform: (source, context): PartialResult =>
    defined<PartialResult>({
      query: source.term,
      results: parseEach(resultSchema, source.content, context),
      totalResults: source.numFound,
    }),
})
