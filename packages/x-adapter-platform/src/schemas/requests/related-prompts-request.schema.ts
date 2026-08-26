import type { PlatformRelatedPromptsRequest } from '../../types/requests/related-prompts-request.model'
import { z } from 'zod'

/**
 * Default implementation for the RelatedPromptsRequestSchema.
 *
 * @public
 */
export const relatedPromptsRequestSchema = z
  .object({
    query: z.string().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformRelatedPromptsRequest => ({
      query: source.query ?? '',
      extraParams: source.extraParams,
    }),
  )
