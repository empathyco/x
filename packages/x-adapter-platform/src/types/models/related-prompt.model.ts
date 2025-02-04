import { Dictionary } from '@empathyco/x-utils';

/**
 * Related prompt model for the `platform` API.
 *
 * @public
 */
export interface PlatformRelatedPrompt {
  nextQueries: string[];
  suggestionText: string;
  type: 'SYNTHETIC' | 'CURATED';
  taggingUri: string;
  nextQueriesTaggingUris: Dictionary<string>;
}
