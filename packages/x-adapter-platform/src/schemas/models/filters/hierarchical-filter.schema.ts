import type { MutableZodSchema } from '@empathyco/x-adapter'
import type { HierarchicalFilter } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { defined, parseEach } from '../../utils'
import { platformFilterValidator } from './platform-filter.validator'

const platformHierarchicalFilterValidator = z.extend(platformFilterValidator, {
  children: z.optional(z.looseObject({ values: z.optional(z.array(z.unknown())) })),
})

/** The hierarchical filter that the Platform API returns. */
interface PlatformHierarchicalFilterSource {
  [key: string]: unknown
  filter: string
  value?: string
  count?: number
  children?: { [key: string]: unknown; values?: unknown[] }
}

/**
 * Default implementation for the HierarchicalFilterSchema.
 *
 * @public
 */
export const hierarchicalFilterSchema: MutableZodSchema<
  PlatformHierarchicalFilterSource,
  HierarchicalFilter
> = createMutableZodSchema({
  source: platformHierarchicalFilterValidator,
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
