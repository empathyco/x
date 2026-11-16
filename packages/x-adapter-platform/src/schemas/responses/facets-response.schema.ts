import type { FacetsResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { facetSchema } from '../models/facet.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the FacetsResponseSchema.
 *
 * @public
 */
export const facetsResponseSchema = createMutableZodSchema<
  PlatformListResponseSource<'catalog', 'facets'>,
  FacetsResponse
>({
  transform: (source, context): FacetsResponse =>
    defined<FacetsResponse>({
      facets: parseEach(facetSchema, source.catalog?.facets, context),
    }),
})
