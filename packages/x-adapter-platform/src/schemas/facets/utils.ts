import { PlatformFacetType } from '../../types/models/facet.model';
import { hierarchicalFilterSchema } from '../models/filters/hierarchical-filter.schema';
import { numberFilterSchema } from '../models/filters/number-filter.schema';
import { simpleFilterSchema } from '../models/filters/simple-filter.schema';
import { FacetConfig } from './types';

/**
 * Returns the facet's config.
 *
 * @param type - The facet type to resolve the configuration.
 * @returns The facet's config.
 */
export function getFacetConfig(type: PlatformFacetType): FacetConfig {
  const typeConfigs: Record<PlatformFacetType, FacetConfig> = {
    value: {
      modelName: 'SimpleFacet',
      schema: simpleFilterSchema
    },
    hierarchical: {
      modelName: 'HierarchicalFacet',
      schema: hierarchicalFilterSchema
    },
    range: {
      modelName: 'NumberRangeFacet',
      schema: numberFilterSchema
    }
  };
  return typeConfigs[type] ?? typeConfigs.value;
}
