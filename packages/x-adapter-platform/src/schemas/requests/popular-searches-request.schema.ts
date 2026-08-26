import type { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model'
import { z } from 'zod'

/**
 * Default implementation for the PopularSearchesRequestSchema.
 *
 * @public
 */
export const popularSearchesRequestSchema = z
  .object({
    start: z.number().optional(),
    rows: z.number().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformPopularSearchesRequest => ({
      start: source.start,
      rows: source.rows,
      extraParams: source.extraParams,
    }),
  )
