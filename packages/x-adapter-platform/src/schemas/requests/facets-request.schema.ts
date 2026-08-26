import type { PlatformFacetsRequest } from '../../types/requests/facets-request.model'
import { z } from 'zod'
import { mapFilters } from '../../mappers/filter.utils'

/**
 * Default implementation for the FacetsRequestSchema.
 *
 * @public
 */
export const facetsRequestSchema = z
  .object({
    query: z.string().optional(),
    origin: z.string().optional(),
    filters: z.record(z.string(), z.array(z.any())).optional(),
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformFacetsRequest => ({
      query: source.query ?? '',
      origin: source.origin,
      filter: mapFilters(source.filters),
      extraParams: source.extraParams,
    }),
  )
