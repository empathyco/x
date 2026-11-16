import { aiSuggestionsSearchSchema } from '../../models/ai/suggestions-search.schema'

/**
 * Default implementation for the AiSuggestionsSearchResponseSchema.
 * @public
 */
export const aiSuggestionsSearchResponseSchema = aiSuggestionsSearchSchema.$extends({
  transform: () => ({}),
})
