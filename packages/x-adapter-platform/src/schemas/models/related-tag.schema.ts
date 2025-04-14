import type { RelatedTag } from '@empathyco/x-types'
import type { PlatformRelatedTag } from '../../types/models/related-tag.model'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the RelatedTagSchema.
 *
 * @public
 */
export const relatedTagSchema = createMutableSchema<PlatformRelatedTag, RelatedTag>({
  query: 'query',
  tag: 'tag',
  modelName: () => 'RelatedTag',
  isCurated: ({ source }) => source === 'CURATED',
})
