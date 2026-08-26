import type { PlatformSemanticQueriesRequest } from '../../types'
import { z } from 'zod'

/**
 * Default implementation for the SemanticQueriesRequestSchema.
 *
 * @public
 */
export const semanticQueriesRequestSchema = z
  .object({
    query: z.string().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformSemanticQueriesRequest => ({
      q: source.query ?? '',
      extraParams: source.extraParams,
    }),
  )
