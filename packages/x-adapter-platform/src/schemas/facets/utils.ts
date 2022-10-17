import { PlatformFacetType } from '../../types';
import { hierarchicalFilterSchema, numberFilterSchema, simpleFilterSchema } from '../models';
import { FacetConfig } from './types';

/**
 * Returns the facet's config.
 *
 * @param type - The facet type to resolve the configuration.
 * @returns The facet's config.
 */
export function getFacetConfig(type: PlatformFacetType): FacetConfig {
  return {
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
  }[type] as FacetConfig;
}
