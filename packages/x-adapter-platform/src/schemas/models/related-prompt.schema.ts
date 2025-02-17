import { createMutableSchema } from '@empathyco/x-adapter';
import { RelatedPrompt, RelatedPromptNextQuery } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import {
  PlatformRelatedPrompt,
  PlatformRelatedPromptNextQueriesTagging
} from '../../types/models/related-prompt.model';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';

export const nextQueriesRelatedPromptsSchema = createMutableSchema<string, RelatedPromptNextQuery>({
  query: data => data,
  toolingDisplayTagging: (data, $context) =>
    getTaggingInfoFromUrl(
      ($context?.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>)[data]
        .toolingDisplay
    ),
  toolingDisplayClickTagging: (data, $context) =>
    getTaggingInfoFromUrl(
      ($context?.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>)[data]
        .toolingDisplayClick
    ),
  toolingDisplayAdd2CartTagging: (data, $context) =>
    getTaggingInfoFromUrl(
      ($context?.nextQueriesTagging as Dictionary<PlatformRelatedPromptNextQueriesTagging>)[data]
        .toolingDisplayAdd2Cart
    )
});

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
      nextQueriesTagging: 'tagging.nextQueries'
    }
  },
  suggestionText: 'suggestionText',
  type: 'type',
  toolingDisplayTagging: ({ tagging }) => getTaggingInfoFromUrl(tagging.toolingDisplay)
});
