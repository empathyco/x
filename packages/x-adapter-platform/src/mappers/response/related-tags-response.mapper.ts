import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { RelatedTagsResponse } from '@empathyco/x-types';
import { PlatformRelatedTagsResponse } from '../../types/responses/related-tags-response.model';
// eslint-disable-next-line max-len
import { relatedTagsResponseMutableSchema } from '../../schemas/response/related-tags-response.schema';

export const relatedTagsResponseMapper = schemaMapperFactory<
  PlatformRelatedTagsResponse,
  RelatedTagsResponse
>(relatedTagsResponseMutableSchema);
