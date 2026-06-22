import type { BooleanFilter } from '@empathyco/x-types'
import type { PlatformFilter } from '../../../types/models/facet.model'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the BooleanFilterSchema.
 *
 * @public
 */
export const booleanFilterSchema = createMutableSchema<PlatformFilter, BooleanFilter>({
  id: 'filter',
  label: 'value',
  facetId: (_, $context) => $context?.facetId as string,
  selected: () => false,
  modelName: () => 'BooleanFilter',
})
