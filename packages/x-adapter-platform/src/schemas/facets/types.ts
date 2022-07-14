import { FacetModelName, Facet } from '@empathyco/x-types';
import { Schema } from '@empathyco/x-adapter';

/**
 * Facet configuration containing the model name and the schema.
 */
export interface FacetConfig {
  modelName: FacetModelName;
  schema: Schema;
}

/**
 * Dictionary grouping facets configurations.
 */
export interface FacetsConfig {
  [key: Facet['id']]: FacetConfig;
}
