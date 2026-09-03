import type {
  BooleanFacet,
  EditableNumberRangeFacet,
  HierarchicalFacet,
  NumberRangeFacet,
  SimpleFacet,
  SliderFacet,
} from '@empathyco/x-types'
import type { PlatformFacet } from '../../types/models/facet.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getFacetConfig } from '../facets/utils'

/**
 * Default implementation for the FacetSchema.
 *
 * @public
 */
export const facetSchema = createMutableSchema<
  PlatformFacet,
  | HierarchicalFacet
  | NumberRangeFacet
  | SimpleFacet
  | EditableNumberRangeFacet
  | BooleanFacet
  | SliderFacet
>({
  id: 'facet',
  label: 'label',
  // eslint-disable-next-line ts/no-unsafe-return
  modelName: ({ type }) => getFacetConfig(type).modelName as any,
  filters: {
    $path: 'values',
    $subSchema: ({ type }) => getFacetConfig(type).schema,
    $context: {
      facetId: 'facet',
    },
  },
})
