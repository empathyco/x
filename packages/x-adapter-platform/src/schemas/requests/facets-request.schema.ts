import type { FacetsRequest } from '@empathyco/x-types'
import type { PlatformFacetsRequest } from '../../types/requests/facets-request.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { mapFilters } from '../../mappers/filter.utils'

/**
 * Default implementation for the FacetsRequestSchema.
 *
 * @public
 */
export const facetsRequestSchema = createMutableSchema<FacetsRequest, PlatformFacetsRequest>({
  query: 'query',
  origin: 'origin',
  filter: ({ filters }) => mapFilters(filters),
  extraParams: 'extraParams',
})
