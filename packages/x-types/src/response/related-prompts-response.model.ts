import type { RelatedPrompt } from '../query-signals/related-prompt.model'

/**
 * Response for the related prompts endpoint.
 *
 * @public
 */
export interface RelatedPromptsResponse {
  relatedPrompts: RelatedPrompt[]
}
