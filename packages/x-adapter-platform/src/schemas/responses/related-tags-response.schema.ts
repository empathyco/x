import type { RelatedTagsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { relatedTagSchema } from '../models/related-tag.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the RelatedTagsResponseSchema.
 *
 * @public
 */
export const relatedTagsResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    data: z.optional(z.looseObject({ relatedtags: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): RelatedTagsResponse =>
    defined<RelatedTagsResponse>({
      relatedTags: parseEach(relatedTagSchema, source.data?.relatedtags, context),
    }),
})
