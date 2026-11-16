import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchSource } from '../../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../../mappers/url.utils'
import { defined, parseEach } from '../../utils'
import { aiSuggestionSearchSchema } from './suggestion-search.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchSchema.
 * @public
 */
export const aiSuggestionsSearchSchema = createTransformSchema<
  PlatformAiSuggestionsSearchSource,
  AiSuggestionsSearchResponse
>({
  transform: ({ items, tagging }, context): AiSuggestionsSearchResponse => ({
    ...defined<Pick<AiSuggestionsSearchResponse, 'suggestions'>>({
      suggestions: parseEach(aiSuggestionSearchSchema, items, context),
    }),
    suggestionsTagging: {
      query: getTaggingInfoFromUrl(tagging?.query ?? ''),
      add2cart: getTaggingInfoFromUrl(tagging?.add2cart ?? ''),
      click: getTaggingInfoFromUrl(tagging?.click ?? ''),
      display: getTaggingInfoFromUrl(tagging?.display ?? ''),
      displayClick: getTaggingInfoFromUrl(tagging?.displayClick ?? ''),
      checkout: getTaggingInfoFromUrl(tagging?.checkout ?? ''),
    },
  }),
})
