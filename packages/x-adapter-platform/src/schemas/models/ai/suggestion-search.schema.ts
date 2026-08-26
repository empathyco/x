import type { AiSuggestionSearch } from '@empathyco/x-types'
import { z } from 'zod'
import { getTaggingInfoFromUrl } from '../../../mappers/url.utils'
import { resultSchema } from '../result.schema'

/**
 * Default implementation for the AiSuggestionSearchSchema.
 * @public
 */
export const aiSuggestionSearchSchema = z
  .object({
    query: z.string().optional(),
    results: z.array(z.any()).optional(),
    numFound: z.number().optional(),
    tagging: z
      .object({
        query: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): AiSuggestionSearch => ({
      query: source.query ?? '',
      results: (source.results ?? []).map(item => resultSchema.parse(item)),
      numFound: source.numFound ?? 0,
      tagging: {
        query: getTaggingInfoFromUrl(source.tagging?.query ?? ''),
      },
    }),
  )
