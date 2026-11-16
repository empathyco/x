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
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { getFacetConfig } from '../facets/utils'
import { defined, parseEach } from '../utils'

type MappedFacet =
  | HierarchicalFacet
  | NumberRangeFacet
  | SimpleFacet
  | EditableNumberRangeFacet
  | BooleanFacet
  | SliderFacet

const platformFacetValidator = z.looseObject({
  facet: z.string(),
  label: z.optional(z.string()),
  type: z.optional(z.custom<PlatformFacetType>(type => typeof type === 'string')),
  values: z.optional(z.array(z.unknown())),
})

/**
 * Default implementation for the FacetSchema.
 *
 * @public
 */
export const facetSchema = createMutableZodSchema({
  source: platformFacetValidator,
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
