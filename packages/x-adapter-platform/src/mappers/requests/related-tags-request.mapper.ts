import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { RelatedTagsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { relatedTagsRequestMutableSchema } from '../../schemas/requests/related-tags-request.schema';
import { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model';

export const relatedTagsRequestMapper = schemaMapperFactory<
  RelatedTagsRequest,
  PlatformRelatedTagsRequest
>(relatedTagsRequestMutableSchema);
