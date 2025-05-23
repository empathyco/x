import type { SimpleFilter } from '@empathyco/x-types'
import type { PlatformFilter } from '../../../types/models/facet.model'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the SimpleFilterSchema.
 *
 * @public
 */
export const simpleFilterSchema = createMutableSchema<PlatformFilter, SimpleFilter>({
  facetId: (_, $context) => $context?.facetId as string,
  label: 'value',
  id: 'filter',
  totalResults: 'count',
  selected: () => false,
  modelName: () => 'SimpleFilter',
})
