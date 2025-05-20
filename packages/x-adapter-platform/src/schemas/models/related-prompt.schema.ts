import type { RelatedPrompt, RelatedPromptNextQuery } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type {
  PlatformRelatedPrompt,
  PlatformRelatedPromptNextQueriesTagging,
} from '../../types/models/related-prompt.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the NextQueriesRelatedPromptsSchema.
 *
 * @public
 */
export const nextQueriesRelatedPromptsSchema = createMutableSchema<string, RelatedPromptNextQuery>({
  query: data => data,
  toolingDisplayTagging: (data, $context) =>
    getTaggingInfoFromUrl(
      ($context?.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>)[data]
        .toolingDisplay,
    ),
  toolingDisplayClickTagging: (data, $context) =>
    getTaggingInfoFromUrl(
      ($context?.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>)[data]
        .toolingDisplayClick,
    ),
  toolingDisplayAdd2CartTagging: (data, $context) =>
    getTaggingInfoFromUrl(
      ($context?.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>)[data]
        .toolingDisplayAdd2Cart,
    ),
})

/**
 * Default implementation for the RelatedPromptSchema.
 *
 * @public
 */
export const relatedPromptSchema = createMutableSchema<PlatformRelatedPrompt, RelatedPrompt>({
  modelName: () => 'RelatedPrompt',
  relatedPromptNextQueries: {
    $path: 'nextQueries',
    $subSchema: nextQueriesRelatedPromptsSchema,
    $context: {
      nextQueriesTagging: 'tagging.nextQueries',
    },
  },
  nextQueries: 'nextQueries',
  suggestionText: 'suggestionText',
  suggestionImageUrl: 'suggestionImageUrl',
  type: 'type',
  toolingDisplayTagging: ({ tagging }) => getTaggingInfoFromUrl(tagging.toolingDisplay),
  tagging: {
    toolingDisplayTagging: ({ tagging }) => getTaggingInfoFromUrl(tagging.toolingDisplay),
    toolingDisplayClickTagging: ({ tagging }) => getTaggingInfoFromUrl(tagging.toolingDisplayClick),
    nextQueriesTagging: {
      $path: 'nextQueries',
      $subSchema: nextQueriesRelatedPromptsSchema,
      $context: {
        nextQueriesTagging: 'tagging.nextQueries',
      },
    },
  },
})
