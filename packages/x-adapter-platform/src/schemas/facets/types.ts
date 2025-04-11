import type { Schema } from '@empathyco/x-adapter'
import type { FacetModelName } from '@empathyco/x-types'

/**
 * Facet configuration containing the model name and the schema.
 *
 * @public
 */
export interface FacetConfig {
  modelName: FacetModelName
  schema: Schema
}
