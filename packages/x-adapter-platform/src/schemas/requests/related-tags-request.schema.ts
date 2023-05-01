import { createMutableSchema } from '@empathyco/x-adapter';
import { RelatedTagsRequest } from '@empathyco/x-types';
import { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model';

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
