import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { aiSuggestionSearchSchema } from './suggestion-search.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchSchema.
 * @public
 */
export const aiSuggestionsSearchSchema = z
  .object({
    items: z.array(z.any()).optional(),
  })
  .passthrough()
  .transform(
    (source): AiSuggestionsSearchResponse => ({
      suggestions: (source.items ?? []).map(item => aiSuggestionSearchSchema.parse(item)),
    }),
  )
