import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { RelatedTag } from '@empathyco/x-types';
import { PlatformRelatedTag } from '../types/models.types';

export const relatedTagSchema: Schema<PlatformRelatedTag, RelatedTag> = {
  query: 'query',
  tag: 'tag',
  modelName: () => 'RelatedTag',
  isCurated: ({ source }) => source === 'CURATED'
};

export const relatedTagMutableSchema = createMutableSchema(relatedTagSchema);
