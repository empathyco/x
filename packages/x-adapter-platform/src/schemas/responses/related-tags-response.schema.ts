import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RelatedTagsResponse } from '@empathyco/x-types';
import { PlatformRelatedTagsResponse } from '../../types/responses/related-tags-response.model';
import { relatedTagMutableSchema } from '../models/related-tag.schema';

export const relatedTagsResponseMutableSchema = createMutableSchema(<
  Schema<PlatformRelatedTagsResponse, RelatedTagsResponse>
>{
  relatedTags: {
    $path: 'data.relatedtags',
    $subSchema: relatedTagMutableSchema
  }
});
