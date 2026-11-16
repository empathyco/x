import type { FacetsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { facetSchema } from '../models/facet.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the FacetsResponseSchema.
 *
 * @public
 */
export const facetsResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    catalog: z.optional(z.looseObject({ facets: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): FacetsResponse =>
    defined<FacetsResponse>({
      facets: parseEach(facetSchema, source.catalog?.facets, context),
    }),
})
