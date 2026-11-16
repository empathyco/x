import type { Suggestion } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'

/**
 * Default implementation for the SuggestionSchema.
 *
 * @public
 */
export const suggestionSchema = createMutableZodSchema({
  source: z.looseObject({
    // TODO: Remove title_raw when endpoint changes and removes it permanently
    title_raw: z.optional(z.string()),
    keywords: z.optional(z.string()),
  }),
  transform: ({ title_raw, keywords }, context): Suggestion => ({
    query: (title_raw ?? keywords) as string,
    key: (title_raw ?? keywords) as string,
    modelName: context.requestParameters?.query ? 'QuerySuggestion' : 'PopularSearch',
    facets: [],
    isCurated: false,
  }),
})
