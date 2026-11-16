import type { RelatedTag } from '@empathyco/x-types'
import type { PlatformRelatedTagSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the RelatedTagSchema.
 *
 * @public
 */
export const relatedTagSchema = createMutableZodSchema<PlatformRelatedTagSource, RelatedTag>({
  transform: (source): RelatedTag => ({
    ...defined<Pick<RelatedTag, 'query' | 'tag'>>({ query: source.query, tag: source.tag }),
    modelName: 'RelatedTag',
    isCurated: source.source === 'CURATED',
  }),
})
