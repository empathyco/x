import type { PlatformFacetType } from '../../types/models/facet.model'
import type { FacetConfig } from './types'
import { editableNumberFilterSchema } from '../models/filters/editable-number-filter.schema'
import { hierarchicalFilterSchema } from '../models/filters/hierarchical-filter.schema'
import { numberFilterSchema } from '../models/filters/number-filter.schema'
import { simpleFilterSchema } from '../models/filters/simple-filter.schema'

/**
 * Returns the facet's config.
 *
 * @param type - The facet type to resolve the configuration.
 * @returns The facet's config.
 *
 * @public
 */
export function getFacetConfig(type: PlatformFacetType): FacetConfig {
  const typeConfigs: Record<PlatformFacetType, FacetConfig> = {
    value: {
      modelName: 'SimpleFacet',
      schema: simpleFilterSchema,
    },
    hierarchical: {
      modelName: 'HierarchicalFacet',
      schema: hierarchicalFilterSchema,
    },
    range: {
      modelName: 'NumberRangeFacet',
      schema: numberFilterSchema,
    },
    'editable-range': {
      modelName: 'EditableNumberRangeFacet',
      schema: editableNumberFilterSchema,
    },
  }
  return typeConfigs[type] ?? typeConfigs.value
}
