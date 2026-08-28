import type { PlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model'
import { z } from 'zod'

/**
 * Default implementation for the IdentifierResultsRequestSchema.
 *
 * @public
 */
export const identifierResultsRequestSchema = z
  .object({
    query: z.string().optional(),
    origin: z.string().optional(),
    start: z.number().optional(),
    rows: z.number().optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformIdentifierResultsRequest => ({
      query: source.query ?? '',
      origin: source.origin,
      start: source.start,
      rows: source.rows,
      extraParams: source.extraParams,
    }),
  )
