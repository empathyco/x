import type { FacetsResponse } from '@empathyco/x-types'
import type { PlatformFacetsResponse } from '../../types/responses'
import { createMutableSchema } from '@empathyco/x-adapter'
import { facetSchema } from '../models/facet.schema'

/**
 * Default implementation for the FacetsResponseSchema.
 *
 * @public
 */
export const facetsResponseSchema = createMutableSchema<PlatformFacetsResponse, FacetsResponse>({
  facets: {
    $path: 'catalog.facets',
    $subSchema: facetSchema,
  },
})
