import { RelatedPrompt } from '../query-signals/related-prompt.model';

/**
 * Response for the related prompts endpoint.
 */
export interface RelatedPromptsResponse {
  relatedPromptsProducts: RelatedPrompt[];
}
