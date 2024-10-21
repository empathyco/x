import { RelatedPrompt } from '../query-signals';

/**
 * Jest schema for validating Related Prompt entities.
 */
export const RelatedPromptSchema: RelatedPrompt = {
  modelName: expect.any(String),
  nextQueries: expect.any(Array),
  suggestionText: expect.any(String),
  type: expect.any(String)
};
