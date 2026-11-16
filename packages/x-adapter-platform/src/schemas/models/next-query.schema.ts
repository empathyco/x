import type { NextQuery } from '@empathyco/x-types'
import type { PlatformNextQuerySource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the NextQuerySchema.
 *
 * @public
 */
export const nextQuerySchema = createTransformSchema<PlatformNextQuerySource, NextQuery>({
  transform: (source): NextQuery => ({
    ...defined<Pick<NextQuery, 'query'>>({ query: source.query }),
    results: [],
    facets: [],
    modelName: 'NextQuery',
    totalResults: 0,
    isCurated: source.source === 'CURATED',
  }),
})
