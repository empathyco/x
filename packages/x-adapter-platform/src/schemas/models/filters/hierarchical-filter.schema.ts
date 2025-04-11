import type { HierarchicalFilter } from '@empathyco/x-types'
import type { PlatformHierarchicalFilter } from '../../../types/models/facet.model'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the HierarchicalFilterSchema.
 *
 * @public
 */
export const hierarchicalFilterSchema = createMutableSchema<
  PlatformHierarchicalFilter,
  HierarchicalFilter
>({
  facetId: (_, $context) => $context?.facetId as string,
  label: 'value',
  id: 'filter',
  totalResults: 'count',
  parentId: (_, $context) => ($context?.parentId as string) ?? null,
  selected: () => false,
  modelName: () => 'HierarchicalFilter',
  children: {
    $path: 'children.values',
    $subSchema: '$self',
    $context: {
      parentId: 'filter',
    },
  },
})
