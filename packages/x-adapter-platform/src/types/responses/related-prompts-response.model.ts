import { PlatformRelatedPrompt } from '../models/related-prompt.model';

/**
 * Response for the `related prompts` endpoint.
 */
export interface PlatformRelatedPromptsResponse {
  data: {
    relatedprompts: PlatformRelatedPrompt[];
  };
  status: number;
}
