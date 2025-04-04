import type { RelatedTagsRequest } from '@empathyco/x-types';
import type { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model';
 
import { schemaMapperFactory } from '@empathyco/x-adapter';
import { relatedTagsRequestSchema } from '../../schemas/requests/related-tags-request.schema';

/**
 * Default implementation for the RelatedTagsRequestMapper.
 *
 * @public
 */
export const relatedTagsRequestMapper = schemaMapperFactory<
  RelatedTagsRequest,
  PlatformRelatedTagsRequest
>(relatedTagsRequestSchema);
