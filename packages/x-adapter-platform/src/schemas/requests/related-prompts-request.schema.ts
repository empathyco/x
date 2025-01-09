import { createMutableSchema } from '@empathyco/x-adapter';
import { RelatedPromptsRequest } from '@empathyco/x-types';
import { PlatformRelatedPromptsRequest } from '../../types/requests/related-prompts-request.model';

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
