import type { SemanticQuery } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Default implementation for the SemanticQuery schema.
 *
 * @public
 */
export const semanticQuerySchema = z
  .object({
    query: z.string().optional(),
    distance: z.number().optional(),
  })
  .passthrough()
  .transform(
    (source): SemanticQuery => ({
      query: source.query ?? '',
      modelName: 'SemanticQuery',
      distance: source.distance ?? 0,
    }),
  )
