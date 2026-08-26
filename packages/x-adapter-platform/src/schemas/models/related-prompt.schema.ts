import type { MapperContext } from '@empathyco/x-adapter'
import type { RelatedPrompt, RelatedPromptNextQuery } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { PlatformRelatedPromptNextQueriesTagging } from '../../types/models/related-prompt.model'
import { z } from 'zod'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Returns a Zod schema for mapping a related prompt next query string
 * to a RelatedPromptNextQuery.
 *
 * @public
 */
export function nextQueriesRelatedPromptsSchema(context: MapperContext) {
  return z.string().transform((data): RelatedPromptNextQuery => {
    const taggingDict =
      context.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>
    return {
      query: data,
      toolingDisplayTagging: getTaggingInfoFromUrl(taggingDict[data].toolingDisplay),
      toolingDisplayClickTagging: getTaggingInfoFromUrl(taggingDict[data].toolingDisplayClick),
      toolingDisplayAdd2CartTagging: getTaggingInfoFromUrl(
        taggingDict[data].toolingDisplayAdd2Cart,
      ),
    }
  })
}

/**
 * Returns a Zod schema for mapping a PlatformRelatedPrompt to a RelatedPrompt.
 *
 * @public
 */
export function relatedPromptSchema(context: MapperContext) {
  return z
    .object({
      nextQueries: z.array(z.string()).optional(),
      suggestionText: z.string().optional(),
      suggestionImageUrl: z.string().optional(),
      type: z.string().optional(),
      tagging: z
        .object({
          toolingDisplay: z.string().optional(),
          toolingDisplayClick: z.string().optional(),
        })
        .passthrough(),
    })
    .passthrough()
    .transform((source): RelatedPrompt => {
      const nextQueriesTagging =
        source.tagging as unknown as Dictionary<PlatformRelatedPromptNextQueriesTagging>
      const nextQueries = source.nextQueries ?? []
      return {
        modelName: 'RelatedPrompt',
        relatedPromptNextQueries: nextQueries.map(nq =>
          nextQueriesRelatedPromptsSchema({
            ...context,
            nextQueriesTagging,
          }).parse(nq),
        ),
        nextQueries,
        suggestionText: source.suggestionText ?? '',
        suggestionImageUrl: source.suggestionImageUrl,
        type: source.type as RelatedPrompt['type'],
        toolingDisplayTagging: getTaggingInfoFromUrl(source.tagging.toolingDisplay ?? ''),
        tagging: {
          toolingDisplayTagging: getTaggingInfoFromUrl(source.tagging.toolingDisplay ?? ''),
          toolingDisplayClickTagging: getTaggingInfoFromUrl(
            source.tagging.toolingDisplayClick ?? '',
          ),
          nextQueriesTagging: nextQueries.map(nq =>
            nextQueriesRelatedPromptsSchema({
              ...context,
              nextQueriesTagging,
            }).parse(nq),
          ),
        },
      }
    })
}
