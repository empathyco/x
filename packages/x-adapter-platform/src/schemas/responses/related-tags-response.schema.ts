import type { RelatedTagsResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { relatedTagSchema } from '../models/related-tag.schema'

/**
 * Default implementation for the RelatedTagsResponseSchema.
 *
 * @public
 */
export const relatedTagsResponseSchema = z
  .object({
    data: z
      .object({
        relatedtags: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): RelatedTagsResponse => ({
      relatedTags: source.data?.relatedtags?.map(item => relatedTagSchema.parse(item)) ?? [],
    }),
  )
