import { createMutableSchema } from '@empathyco/x-adapter';
import { RelatedPromptsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformRelatedPromptsResponse } from '../../types/responses/related-prompts-response.model';
import { relatedPromptSchema } from '../models/related-prompt.schema';

/**
 * Default implementation for the RelatedPromptsResponseSchema.
 */
export const relatedPromptsResponseSchema = createMutableSchema<
  PlatformRelatedPromptsResponse,
  RelatedPromptsResponse
>({
  relatedPrompts: {
    $path: 'data.relatedprompts',
    $subSchema: relatedPromptSchema
  }
});
