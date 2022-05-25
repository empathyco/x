import { FacetModelName } from '@empathyco/x-types';
import { Schema } from '@empathyco/x-adapter-next';

/**
 * Facet configuration containing the model name and the schema.
 */
export type FacetConfig = { modelName: FacetModelName; getSchema: () => Schema };

/**
 * Dictionary grouping facets configurations.
 */
export type FacetsConfig = Record<string, FacetConfig>;
