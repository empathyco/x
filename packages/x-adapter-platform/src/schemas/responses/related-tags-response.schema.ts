import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { RelatedTagsResponse } from '@empathyco/x-types';
import { PlatformRelatedTagsResponse } from '../../types/responses/related-tags-response.model';
import { relatedTagSchema } from '../models/related-tag.schema';

export const relatedTagsResponseSchema = createMutableSchema(<
  Schema<PlatformRelatedTagsResponse, RelatedTagsResponse>
>{
  relatedTags: {
    $path: 'data.relatedtags',
    $subSchema: relatedTagSchema
  }
});
