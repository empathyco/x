/**
 * Related prompt model for the `platform` API.
 *
 * @public
 */
export interface PlatformRelatedPrompt {
  nextQueries: string[];
  suggestionText: string;
  type: 'SYNTHETIC' | 'CURATED';
  uuid: string;
}
