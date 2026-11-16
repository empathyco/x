import type { NextQuery } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { defined } from '../utils'

/**
 * Default implementation for the NextQuerySchema.
 *
 * @public
 */
export const nextQuerySchema = createMutableZodSchema({
  source: z.looseObject({
    query: z.string(),
    source: z.optional(z.string()),
  }),
  transform: (source): NextQuery => ({
    ...defined<Pick<NextQuery, 'query'>>({ query: source.query }),
    results: [],
    facets: [],
    modelName: 'NextQuery',
    totalResults: 0,
    isCurated: source.source === 'CURATED',
  }),
})
