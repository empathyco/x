import type { Suggestion } from '@empathyco/x-types'
import type { PlatformSuggestionSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the SuggestionSchema.
 *
 * @public
 */
export const suggestionSchema = createMutableZodSchema<PlatformSuggestionSource, Suggestion>({
  transform: ({ title_raw, keywords }, context): Suggestion => ({
    query: (title_raw ?? keywords) as string,
    key: (title_raw ?? keywords) as string,
    modelName: context.requestParameters?.query ? 'QuerySuggestion' : 'PopularSearch',
    facets: [],
    isCurated: false,
  }),
})
