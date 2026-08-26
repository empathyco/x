import type { RelatedTag } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Default implementation for the RelatedTagSchema.
 *
 * @public
 */
export const relatedTagSchema = z
  .object({
    query: z.string().optional(),
    tag: z.string().optional(),
    source: z.string().optional(),
  })
  .passthrough()
  .transform(
    (source): RelatedTag => ({
      query: source.query ?? '',
      tag: source.tag ?? '',
      modelName: 'RelatedTag',
      isCurated: source.source === 'CURATED',
    }),
  )
