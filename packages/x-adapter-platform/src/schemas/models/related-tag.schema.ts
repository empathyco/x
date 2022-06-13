import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RelatedTag } from '@empathyco/x-types';
import { PlatformRelatedTag } from '../../types/models/related-tag.model';

export const relatedTagMutableSchema = createMutableSchema<Schema<PlatformRelatedTag, RelatedTag>>({
  query: 'query',
  tag: 'tag',
  modelName: () => 'RelatedTag',
  isCurated: ({ source }) => source === 'CURATED'
});
