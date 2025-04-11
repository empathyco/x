import type { SemanticQuery } from '@empathyco/x-types'
import type { PlatformSemanticQuery } from '../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the SemanticQuery schema.
 *
 * @public
 */
export const semanticQuerySchema = createMutableSchema<PlatformSemanticQuery, SemanticQuery>({
  query: 'query',
  modelName: () => 'SemanticQuery',
  distance: 'distance',
})
