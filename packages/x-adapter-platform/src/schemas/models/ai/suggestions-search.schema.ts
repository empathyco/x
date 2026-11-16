import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { getTaggingInfoFromUrl } from '../../../mappers/url.utils'
import { defined, parseEach } from '../../utils'
import { aiSuggestionSearchSchema } from './suggestion-search.schema'

/**
 * Default implementation for the AIOverviewSuggestionsSearchSchema.
 * @public
 */
export const aiSuggestionsSearchSchema = createMutableZodSchema({
  source: z.looseObject({
    items: z.optional(z.array(z.unknown())),
    tagging: z.optional(
      z.looseObject({
        query: z.optional(z.string()),
        add2cart: z.optional(z.string()),
        click: z.optional(z.string()),
        display: z.optional(z.string()),
        displayClick: z.optional(z.string()),
        checkout: z.optional(z.string()),
      }),
    ),
  }),
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
