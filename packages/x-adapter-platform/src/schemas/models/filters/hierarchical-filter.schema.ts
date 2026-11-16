import type { TransformSchema } from '@empathyco/x-adapter'
import type { HierarchicalFilter } from '@empathyco/x-types'
import type { PlatformHierarchicalFilterSource } from '../../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined, parseEach } from '../../utils'

/**
 * Default implementation for the HierarchicalFilterSchema.
 *
 * @public
 */
export const hierarchicalFilterSchema: TransformSchema<
  PlatformHierarchicalFilterSource,
  HierarchicalFilter
> = createTransformSchema<PlatformHierarchicalFilterSource, HierarchicalFilter>({
  transform: (source, context): HierarchicalFilter => ({
    ...defined<Pick<HierarchicalFilter, 'id' | 'label' | 'totalResults' | 'children'>>({
      id: source.filter,
      label: source.value,
      totalResults: source.count,
      // The children are mapped with this same schema, so they also apply its overrides.
      children: parseEach(hierarchicalFilterSchema, source.children?.values, {
        ...context,
        parentId: source.filter,
      }),
    }),
    facetId: context.facetId as string,
    parentId: (context.parentId as string) ?? null,
    selected: false,
    modelName: 'HierarchicalFilter',
  }),
})
