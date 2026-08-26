import type { FacetModelName } from '@empathyco/x-types'
import type { z } from 'zod'

/**
 * Facet configuration containing the model name and the Zod mapper schema.
 *
 * @public
 */
export interface FacetConfig {
  modelName: FacetModelName
  schema: (context: Record<string, unknown>) => z.ZodTypeAny
}
