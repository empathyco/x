import type { MutableZodSchema } from '@empathyco/x-adapter'
import type { FacetModelName, Filter } from '@empathyco/x-types'

/**
 * Facet configuration containing the model name and the schema of its filters.
 *
 * @public
 */
export interface FacetConfig {
  modelName: FacetModelName
  schema: MutableZodSchema<any, Filter>
}
