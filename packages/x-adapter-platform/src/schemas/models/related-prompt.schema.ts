import { createMutableSchema } from '@empathyco/x-adapter';
import { RelatedPrompt, RelatedPromptNextQuery } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { PlatformRelatedPrompt } from '../../types/models/related-prompt.model';
import {
  getTaggingInfoFromUrl,
  getToolingDisplayClickTaggingInfoFromUrl
} from '../../mappers/url.utils';

export const nextQueriesRelatedPromptsSchema = createMutableSchema<string, RelatedPromptNextQuery>({
  query: data => data,
  toolingDisplayTagging: (data, $context) =>
    getTaggingInfoFromUrl(($context?.nextQueriesTaggingUris as Dictionary<string>)[data]),
  toolingDisplayClickTagging: (data, $context) =>
    getToolingDisplayClickTaggingInfoFromUrl(
      ($context?.nextQueriesTaggingUris as Dictionary<string>)[data],
      'toolingDisplayClick'
    ),
  toolingDisplayAdd2CartTagging: (data, $context) =>
    getToolingDisplayClickTaggingInfoFromUrl(
      ($context?.nextQueriesTaggingUris as Dictionary<string>)[data],
      'toolingDisplayAdd2Cart'
    )
});

/**
 * Default implementation for the RelatedPromptSchema.
 *
 * @public
 */
export const relatedPromptSchema = createMutableSchema<PlatformRelatedPrompt, RelatedPrompt>({
  modelName: () => 'RelatedPrompt',
  nextQueriesRelatedPrompts: {
    $path: 'nextQueries',
    $subSchema: nextQueriesRelatedPromptsSchema,
    $context: {
      nextQueriesTaggingUris: 'nextQueriesTaggingUris'
    }
  },
  suggestionText: 'suggestionText',
  type: 'type',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  toolingDisplayTagging: ({ taggingUri }) => getTaggingInfoFromUrl(taggingUri)
});
