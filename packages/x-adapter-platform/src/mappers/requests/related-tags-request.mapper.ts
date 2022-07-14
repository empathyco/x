import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RelatedTagsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { relatedTagsRequestSchema } from '../../schemas/requests/related-tags-request.schema';
import { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model';

export const relatedTagsRequestMapper = schemaMapperFactory<
  RelatedTagsRequest,
  PlatformRelatedTagsRequest
>(relatedTagsRequestSchema);
