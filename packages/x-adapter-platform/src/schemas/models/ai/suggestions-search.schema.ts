import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'
import { aiSuggestionSearchSchema } from './suggestion-search.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchSchema.
 * @public
 */
export const aiSuggestionsSearchSchema = createMutableSchema<
  PlatformAiSuggestionsSearchResponse,
  AiSuggestionsSearchResponse
>({
  suggestions: {
    $path: 'items',
    $subSchema: aiSuggestionSearchSchema,
  },
})
