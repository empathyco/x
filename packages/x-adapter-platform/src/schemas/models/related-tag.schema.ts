import { createMutableSchema } from '@empathyco/x-adapter';
import { RelatedTag } from '@empathyco/x-types';
import { PlatformRelatedTag } from '../../types/models/related-tag.model';

export const relatedTagSchema = createMutableSchema<PlatformRelatedTag, RelatedTag>({
  query: 'query',
  tag: 'tag',
  modelName: () => 'RelatedTag',
  isCurated: ({ source }) => source === 'CURATED'
});
