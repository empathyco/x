import { schemaMapperFactory } from '@empathyco/x-adapter';
import { RelatedTagsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { relatedTagsResponseSchema } from '../../schemas/responses/related-tags-response.schema';
import { PlatformRelatedTagsResponse } from '../../types/responses/related-tags-response.model';

export const relatedTagsResponseMapper = schemaMapperFactory<
  PlatformRelatedTagsResponse,
  RelatedTagsResponse
>(relatedTagsResponseSchema);
