import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../../mappers/url.utils'
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
  suggestionsTagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? ''),
    add2cart: ({ tagging }) => getTaggingInfoFromUrl(tagging?.add2cart ?? ''),
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? ''),
    display: ({ tagging }) => getTaggingInfoFromUrl(tagging?.display ?? ''),
    displayClick: ({ tagging }) => getTaggingInfoFromUrl(tagging?.displayClick ?? ''),
    checkout: ({ tagging }) => getTaggingInfoFromUrl(tagging?.checkout ?? ''),
  },
})
