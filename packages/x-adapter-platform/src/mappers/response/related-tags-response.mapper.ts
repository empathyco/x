import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PlatformRelatedTagsResponse, RelatedTagsResponse } from '../../types';
import { relatedTagMutableSchema } from '../../schemas';

export const relatedTagsResponseSchema: Schema<PlatformRelatedTagsResponse, RelatedTagsResponse> = {
  relatedTags: {
    $path: 'data.relatedtags',
    $subSchema: relatedTagMutableSchema
  }
};

export const relatedTagsResponseMutableSchema = createMutableSchema(relatedTagsResponseSchema);

export const relatedTagsResponseMapper = schemaMapperFactory<
  PlatformRelatedTagsResponse,
  RelatedTagsResponse
>(relatedTagsResponseMutableSchema);
