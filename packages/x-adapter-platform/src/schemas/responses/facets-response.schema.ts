import type { FacetsResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { facetSchema } from '../models/facet.schema'

/**
 * Default implementation for the FacetsResponseSchema.
 *
 * @public
 */
export const facetsResponseSchema = z
  .object({
    catalog: z
      .object({
        facets: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): FacetsResponse => ({
      facets: source.catalog?.facets?.map(item => facetSchema.parse(item)),
    }),
  )
