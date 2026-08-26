import type { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model'
import { z } from 'zod'

/**
 * Default implementation for the RelatedTagsRequestSchema.
 *
 * @public
 */
export const relatedTagsRequestSchema = z
  .object({
    query: z.string().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformRelatedTagsRequest => ({
      query: source.query ?? '',
      extraParams: source.extraParams,
    }),
  )
