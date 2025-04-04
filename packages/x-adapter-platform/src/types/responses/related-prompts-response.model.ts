import type { PlatformRelatedPrompt } from '../models/related-prompt.model';

/**
 * Response for the `related prompts` endpoint.
 *
 * @public
 */
export interface PlatformRelatedPromptsResponse {
  data: {
    relatedprompts: PlatformRelatedPrompt[];
  };
  status: number;
}
