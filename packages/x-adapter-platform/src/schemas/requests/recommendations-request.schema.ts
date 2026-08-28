import type { PlatformRecommendationsRequest } from '../../types/requests/recommendations-request.model'
import { z } from 'zod'

/**
 * Default implementation for the RecommendationsRequestSchema.
 *
 * @public
 */
export const recommendationsRequestSchema = z
  .object({
    start: z.number().optional(),
    rows: z.number().optional(),
    origin: z.string().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformRecommendationsRequest => ({
      start: source.start,
      rows: source.rows,
      origin: source.origin,
      extraParams: source.extraParams,
    }),
  )
