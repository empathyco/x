import type {
  BooleanFacet,
  EditableNumberRangeFacet,
  Facet,
  HierarchicalFacet,
  NumberRangeFacet,
  SimpleFacet,
  SliderFacet,
} from '@empathyco/x-types'
import type { PlatformFacetType } from '../../types/models/facet.model'
import type { PlatformFacetSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { getFacetConfig } from '../facets/utils'
import { defined, parseEach } from '../utils'

type MappedFacet =
  | HierarchicalFacet
  | NumberRangeFacet
  | SimpleFacet
  | EditableNumberRangeFacet
  | BooleanFacet
  | SliderFacet

/**
 * Default implementation for the FacetSchema.
 *
 * @public
 */
export const facetSchema = createTransformSchema<PlatformFacetSource, MappedFacet>({
  transform: (source, context): MappedFacet => {
    const { modelName, schema } = getFacetConfig(source.type as PlatformFacetType)
    return defined<Facet>({
      id: source.facet,
      label: source.label,
      modelName,
      filters: parseEach(schema, source.values, { ...context, facetId: source.facet }),
    }) as MappedFacet
  },
})
