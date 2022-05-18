import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RelatedTagsRequest } from '@empathyco/x-types';
import { BasePlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model';

export const relatedTagsRequestSchema: Schema<RelatedTagsRequest, BasePlatformRelatedTagsRequest> =
  {
    query: 'query'
  };

export const relatedTagsRequestMutableSchema = createMutableSchema(relatedTagsRequestSchema);
