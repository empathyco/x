import { RelatedPrompt } from '../query-signals';
import { TaggingRequestSchema } from './tagging.schema';

/**
 * Jest schema for validating Related Prompt entities.
 */
export const RelatedPromptSchema: RelatedPrompt = {
  modelName: expect.any(String),
  nextQueriesRelatedPrompts: expect.any(Array),
  suggestionText: expect.any(String),
  type: expect.any(String),
  toolingDisplayTagging: TaggingRequestSchema
};
