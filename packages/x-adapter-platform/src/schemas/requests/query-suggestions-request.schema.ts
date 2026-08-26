import type { PlatformQuerySuggestionsRequest } from '../../types/requests/query-suggestions-request.model'
import { z } from 'zod'

/**
 * Default implementation for the QuerySuggestionsRequestSchema.
 *
 * @public
 */
export const querySuggestionsRequestSchema = z
  .object({
    query: z.string().optional(),
    start: z.number().optional(),
    rows: z.number().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformQuerySuggestionsRequest => ({
      query: source.query ?? '',
      start: source.start,
      rows: source.rows,
      extraParams: source.extraParams,
    }),
  )
