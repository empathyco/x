import type { AiSuggestionSearch } from '@empathyco/x-types'
import type { PlatformAiSuggestionSearch } from '../../../types/models/ai/suggestion-search.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../../mappers/url.utils'
import { resultSchema } from '../result.schema'

/**
 * Default implementation for the AiSuggestionSearchSchema.
 * @public
 */
export const aiSuggestionSearchSchema = createMutableSchema<
  PlatformAiSuggestionSearch,
  AiSuggestionSearch
>({
  query: 'query',
  results: {
    $path: 'results',
    $subSchema: resultSchema,
  },
  numFound: 'numFound',
  tagging: ({ tagging }) => ({
    query: getTaggingInfoFromUrl(tagging.query),
  }),
})
