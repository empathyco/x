import type { RelatedTag } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { defined } from '../utils'

/**
 * Default implementation for the RelatedTagSchema.
 *
 * @public
 */
export const relatedTagSchema = createMutableZodSchema({
  source: z.looseObject({
    query: z.string(),
    tag: z.string(),
    source: z.optional(z.string()),
  }),
  transform: (source): RelatedTag => ({
    ...defined<Pick<RelatedTag, 'query' | 'tag'>>({ query: source.query, tag: source.tag }),
    modelName: 'RelatedTag',
    isCurated: source.source === 'CURATED',
  }),
})
