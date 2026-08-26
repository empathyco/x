import type { PartialResult } from '@empathyco/x-types'
import { z } from 'zod'
import { resultSchema } from './result.schema'

/**
 * Default implementation for the PartialResultsSchema.
 *
 * @public
 */
export const partialResultsSchema = z
  .object({
    term: z.string().optional(),
    numFound: z.number().optional(),
    content: z.array(z.any()).optional(),
  })
  .passthrough()
  .transform(
    (source): PartialResult => ({
      query: source.term ?? '',
      results: (source.content ?? []).map(item => resultSchema.parse(item)),
      totalResults: source.numFound ?? null,
    }),
  )
