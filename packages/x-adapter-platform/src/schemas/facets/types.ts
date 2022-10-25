import { Schema } from '@empathyco/x-adapter';
import { FacetModelName } from '@empathyco/x-types';

/**
 * Facet configuration containing the model name and the schema.
 */
export interface FacetConfig {
  modelName: FacetModelName;
  schema: Schema;
}
