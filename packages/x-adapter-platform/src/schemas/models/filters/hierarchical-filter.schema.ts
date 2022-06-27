import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { HierarchicalFilter } from '@empathyco/x-types';
import { PlatformHierarchicalFilter } from '../../../types/models/facet.model';

export const hierarchicalFilterSchema = createMutableSchema<
  Schema<PlatformHierarchicalFilter, HierarchicalFilter>
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
      parentId: 'filter'
    }
  }
});
