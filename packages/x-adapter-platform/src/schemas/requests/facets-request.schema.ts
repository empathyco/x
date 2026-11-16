import type { FacetsRequest } from '@empathyco/x-types'
import type { PlatformFacetsRequest } from '../../types/requests/facets-request.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../mappers/filter.utils'
import { defined } from '../utils'

/**
 * Default implementation for the FacetsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const facetsRequestSchema = createMutableZodSchema<FacetsRequest, PlatformFacetsRequest>({
  transform: (source): PlatformFacetsRequest =>
    defined<PlatformFacetsRequest>({
      query: source.query,
      origin: source.origin,
      filter: mapFilters(source.filters),
      extraParams: source.extraParams,
    }),
})
