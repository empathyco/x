import type { PlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model'
import { z } from 'zod'

/**
 * Default implementation for the NextQueriesRequestSchema.
 *
 * @public
 */
export const nextQueriesRequestSchema = z
  .object({
    query: z.string().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformNextQueriesRequest => ({
      query: source.query ?? '',
      extraParams: source.extraParams,
    }),
  )
