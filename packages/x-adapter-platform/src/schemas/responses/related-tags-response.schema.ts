import type { Schema } from '@empathyco/x-adapter'
import type { RelatedTagsResponse } from '@empathyco/x-types'
import type { PlatformRelatedTagsResponse } from '../../types/responses/related-tags-response.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { relatedTagSchema } from '../models/related-tag.schema'

/**
 * Default implementation for the RelatedTagsResponseSchema.
 *
 * @public
 */
export const relatedTagsResponseSchema = createMutableSchema(<
  Schema<PlatformRelatedTagsResponse, RelatedTagsResponse>
>{
  relatedTags: {
    $path: 'data.relatedtags',
    $subSchema: relatedTagSchema,
  },
})
