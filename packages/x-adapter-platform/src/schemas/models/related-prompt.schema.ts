import type { RelatedPrompt, RelatedPromptNextQuery } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PlatformRelatedPromptNextQueriesTagging } from '../../types/models/related-prompt.model'
import type { PlatformRelatedPromptSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the NextQueriesRelatedPromptsSchema.
 *
 * @public
 */
export const nextQueriesRelatedPromptsSchema = createTransformSchema<
  string,
  RelatedPromptNextQuery
>({
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

/**
 * Default implementation for the RelatedPromptSchema.
 *
 * @public
 */
export const relatedPromptSchema = createTransformSchema<
  PlatformRelatedPromptSource,
  RelatedPrompt
>({
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
