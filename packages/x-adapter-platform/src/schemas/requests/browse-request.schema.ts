import type { PlatformBrowseRequest } from '../../types/requests/browse-request.model'
import { z } from 'zod'
import { mapFilters } from '../../mappers/filter.utils'

/**
 * Default implementation for the BrowseRequestSchema.
 *
 * @public
 */
export const browseRequestSchema = z
  .object({
    browseField: z.string().optional(),
    browseValue: z.string().optional(),
    origin: z.string().optional(),
    start: z.number().optional(),
    rows: z.number().optional(),
    sort: z.string().optional(),
    filters: z.record(z.string(), z.array(z.any())).optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformBrowseRequest => ({
      browseField: source.browseField ?? '',
      browseValue: source.browseValue ?? '',
      origin: source.origin,
      start: source.start,
      rows: source.rows,
      sort: source.sort,
      filter: mapFilters(source.filters),
      extraParams: source.extraParams,
    }),
  )
