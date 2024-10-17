import { RelatedPrompt } from '../query-signals/related-prompt.model';

/**
 * Response for the next queries endpoint.
 *
 * @public
 */
export interface RelatedPromptsResponse {
  relatedPromptsProducts: RelatedPrompt[];
}
