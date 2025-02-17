import { RelatedPrompt, RelatedPromptNextQuery } from '@empathyco/x-types';
import { getTaggingResponseStub } from './tagging-response-stubs.factory';

/**
 * Creates a {@link @empathyco/x-types#RelatedPrompt | related prompts} stub.
 *
 * @param amount - Number of stubbed related prompts to create.
 *
 * @returns Array of related prompts stub.
 *
 * @internal
 */
export function getRelatedPromptsStub(amount = 12): RelatedPrompt[] {
  return Array.from({ length: amount }, (_, index) =>
    createRelatedPromptStub(`Related Prompt ${index + 1}`)
  );
}

/**
 * Creates a related prompt stub with the provided options.
 *
 * @param suggestionText - The suggested text of the related prompt.
 *
 * @returns A related prompt.
 */
export function createRelatedPromptStub(suggestionText: string): RelatedPrompt {
  return {
    suggestionText,
    relatedPromptNextQueries: createNextQueriesArrayStub(10),
    modelName: 'RelatedPrompt',
    type: Math.random() < 0.5 ? 'CURATED' : 'SYNTHETIC',
    toolingDisplayTagging: getTaggingResponseStub()
  };
}

/**
 * Creates an array of next queries.
 *
 * @param amount - Number of next queries to create.
 *
 * @returns Array of next queries.
 */
function createNextQueriesArrayStub(amount: number): RelatedPromptNextQuery[] {
  return Array.from(
    { length: amount },
    (_, index) =>
      ({
        query: `Next query ${index + 1}`,
        toolingDisplayTagging: getTaggingResponseStub(),
        toolingDisplayAdd2CartTagging: getTaggingResponseStub(),
        toolingDisplayClickTagging: getTaggingResponseStub()
      } as RelatedPromptNextQuery)
  );
}
