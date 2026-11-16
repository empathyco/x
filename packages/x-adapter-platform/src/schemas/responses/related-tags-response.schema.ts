import type { RelatedTagsResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { relatedTagSchema } from '../models/related-tag.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the RelatedTagsResponseSchema.
 *
 * @public
 */
export const relatedTagsResponseSchema = createTransformSchema<
  PlatformListResponseSource<'data', 'relatedtags'>,
  RelatedTagsResponse
>({
  transform: (source, context): RelatedTagsResponse =>
    defined<RelatedTagsResponse>({
      relatedTags: parseEach(relatedTagSchema, source.data?.relatedtags, context),
    }),
})
