import type { RelatedTagsRequest } from '@empathyco/x-types';
import type { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model';
import { createMutableSchema } from '@empathyco/x-adapter';

/**
 * Default implementation for the RelatedTagsRequestSchema.
 *
 * @public
 */
export const relatedTagsRequestSchema = createMutableSchema<
  RelatedTagsRequest,
  PlatformRelatedTagsRequest
>({
  query: 'query',
  extraParams: 'extraParams'
});
