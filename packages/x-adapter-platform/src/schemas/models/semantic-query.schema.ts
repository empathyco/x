import type { SemanticQuery } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { defined } from '../utils'

/**
 * Default implementation for the SemanticQuerySchema.
 *
 * @public
 */
export const semanticQuerySchema = createMutableZodSchema({
  source: z.looseObject({
    query: z.string(),
    distance: z.number(),
  }),
  transform: (source): SemanticQuery => ({
    ...defined<Pick<SemanticQuery, 'query' | 'distance'>>({
      query: source.query,
      distance: source.distance,
    }),
    modelName: 'SemanticQuery',
  }),
})
