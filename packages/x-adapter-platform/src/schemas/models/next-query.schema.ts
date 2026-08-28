import type { NextQuery } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Default implementation for the NextQuerySchema.
 *
 * @public
 */
export const nextQuerySchema = z
  .object({
    query: z.string().optional(),
    source: z.string().optional(),
  })
  .passthrough()
  .transform(
    (source): NextQuery => ({
      query: source.query ?? '',
      results: [],
      facets: [],
      modelName: 'NextQuery',
      totalResults: 0,
      isCurated: source.source === 'CURATED',
    }),
  )
