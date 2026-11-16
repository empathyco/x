import type { RelatedPrompt, RelatedPromptNextQuery } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PlatformRelatedPromptNextQueriesTagging } from '../../types/models/related-prompt.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the NextQueriesRelatedPromptsSchema.
 *
 * @public
 */
export const nextQueriesRelatedPromptsSchema = createMutableZodSchema({
  source: z.string(),
  transform: (query, context): RelatedPromptNextQuery => {
    const tagging = (
      context.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>
    )[query]
    return {
      query,
      toolingDisplayTagging: getTaggingInfoFromUrl(tagging.toolingDisplay),
      toolingDisplayClickTagging: getTaggingInfoFromUrl(tagging.toolingDisplayClick),
      toolingDisplayAdd2CartTagging: getTaggingInfoFromUrl(tagging.toolingDisplayAdd2Cart),
    }
  },
})

const nextQueryTagging = z.looseObject({
  toolingDisplay: z.optional(z.string()),
  toolingDisplayClick: z.optional(z.string()),
  toolingDisplayAdd2Cart: z.optional(z.string()),
})

/**
 * Default implementation for the RelatedPromptSchema.
 *
 * @public
 */
export const relatedPromptSchema = createMutableZodSchema({
  source: z.looseObject({
    nextQueries: z.optional(z.array(z.string())),
    suggestionText: z.string(),
    suggestionImageUrl: z.optional(z.string()),
    type: z.optional(z.enum(['SYNTHETIC', 'CURATED'])),
    tagging: z.looseObject({
      toolingDisplay: z.optional(z.string()),
      toolingDisplayClick: z.optional(z.string()),
      nextQueries: z.optional(z.record(z.string(), nextQueryTagging)),
    }),
  }),
  transform: (source, context): RelatedPrompt => {
    const { tagging } = source
    const nextQueriesContext = { ...context, nextQueriesTagging: tagging.nextQueries }
    const mapNextQueries = () =>
      parseEach(nextQueriesRelatedPromptsSchema, source.nextQueries, nextQueriesContext)
    return {
      modelName: 'RelatedPrompt',
      ...defined<
        Pick<
          RelatedPrompt,
          | 'relatedPromptNextQueries'
          | 'nextQueries'
          | 'suggestionText'
          | 'suggestionImageUrl'
          | 'type'
        >
      >({
        relatedPromptNextQueries: mapNextQueries(),
        nextQueries: source.nextQueries,
        suggestionText: source.suggestionText,
        suggestionImageUrl: source.suggestionImageUrl,
        type: source.type,
      }),
      toolingDisplayTagging: getTaggingInfoFromUrl(tagging.toolingDisplay as string),
      tagging: {
        toolingDisplayTagging: getTaggingInfoFromUrl(tagging.toolingDisplay as string),
        toolingDisplayClickTagging: getTaggingInfoFromUrl(tagging.toolingDisplayClick as string),
        ...defined<Pick<NonNullable<RelatedPrompt['tagging']>, 'nextQueriesTagging'>>({
          nextQueriesTagging: mapNextQueries(),
        }),
      },
    }
  },
})
