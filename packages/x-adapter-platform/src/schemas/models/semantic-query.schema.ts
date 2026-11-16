import type { SemanticQuery } from '@empathyco/x-types'
import type { PlatformSemanticQuerySource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the SemanticQuerySchema.
 *
 * @public
 */
export const semanticQuerySchema = createMutableZodSchema<
  PlatformSemanticQuerySource,
  SemanticQuery
>({
  transform: (source): SemanticQuery => ({
    ...defined<Pick<SemanticQuery, 'query' | 'distance'>>({
      query: source.query,
      distance: source.distance,
    }),
    modelName: 'SemanticQuery',
  }),
})
