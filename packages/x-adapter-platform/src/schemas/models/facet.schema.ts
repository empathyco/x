import type {
  BooleanFacet,
  EditableNumberRangeFacet,
  Facet,
  HierarchicalFacet,
  NumberRangeFacet,
  SimpleFacet,
} from '@empathyco/x-types'
import { z } from 'zod'
import { getFacetConfig } from '../facets/utils'

/**
 * Default implementation for the FacetSchema.
 *
 * @public
 */
export const facetSchema = z
  .object({
    facet: z.string(),
    label: z.string().optional(),
    type: z.string(),
    values: z.array(z.any()).optional(),
  })
  .passthrough()
  .transform(
    (
      source,
    ):
      | HierarchicalFacet
      | NumberRangeFacet
      | SimpleFacet
      | EditableNumberRangeFacet
      | BooleanFacet => {
      const facetConfig = getFacetConfig(source.type as Parameters<typeof getFacetConfig>[0])
      const filterSchema = facetConfig.schema({ facetId: source.facet })
      return {
        id: source.facet,
        label: source.label ?? '',
        modelName: facetConfig.modelName,
        filters: source.values?.map(v => filterSchema.parse(v)) ?? [],
      } as Facet as
        | HierarchicalFacet
        | NumberRangeFacet
        | SimpleFacet
        | EditableNumberRangeFacet
        | BooleanFacet
    },
  )
