import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RelatedTagsRequest } from '@empathyco/x-types';
import { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model';

export const relatedTagsRequestMutableSchema = createMutableSchema<
  Schema<RelatedTagsRequest, PlatformRelatedTagsRequest>
>({
  query: 'query',
  extraParams: 'extraParams'
});
