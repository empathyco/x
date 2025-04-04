import type { RelatedPromptsRequest } from '@empathyco/x-types';
import type { PlatformRelatedPromptsRequest } from '../../types/requests/related-prompts-request.model';
import { createMutableSchema } from '@empathyco/x-adapter';

/**
 * Default implementation for the RelatedPromptsRequestSchema.
 *
 * @public
 */
export const relatedPromptsRequestSchema = createMutableSchema<
  RelatedPromptsRequest,
  PlatformRelatedPromptsRequest
>({
  query: 'query',
  extraParams: 'extraParams'
});
