import type { RelatedPrompt } from '../query-signals'
import { TaggingRequestSchema } from './tagging.schema'

/**
 * Jest schema for validating Related Prompt entities.
 */
export const RelatedPromptSchema: RelatedPrompt = {
  modelName: expect.any(String),
  nextQueries: expect.any(Array),
  relatedPromptNextQueries: expect.any(Array),
  suggestionText: expect.any(String),
  suggestionImageUrl: expect.any(String),
  type: expect.any(String),
  toolingDisplayTagging: TaggingRequestSchema,
  tagging: {
    toolingDisplayTagging: TaggingRequestSchema,
    toolingDisplayClickTagging: TaggingRequestSchema,
    nextQueriesTagging: expect.any(Array),
  },
}
