/**
 * Related prompt model for the `platform` API.
 */
export interface PlatformRelatedPrompt {
  nextQueries: string[];
  suggestionText: string;
  type: 'SYNTHETIC' | 'CURATED';
}
