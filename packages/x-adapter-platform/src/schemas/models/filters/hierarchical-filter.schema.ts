import type { MapperContext } from '@empathyco/x-adapter'
import type { HierarchicalFilter } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Returns a Zod schema for mapping a PlatformFilter to a HierarchicalFilter.
 * Supports recursive children via z.lazy().
 *
 * @public
 */
export function hierarchicalFilterSchema(context: MapperContext): z.ZodType<HierarchicalFilter> {
  return z
    .object({
      filter: z.string().optional(),
      value: z.string().optional(),
      count: z.number().optional(),
      children: z
        .object({
          values: z.array(z.any()).optional(),
        })
        .passthrough()
        .optional(),
    })
    .passthrough()
    .transform(
      (source): HierarchicalFilter => ({
        id: source.filter ?? '',
        label: source.value ?? '',
        facetId: context.facetId as string,
        totalResults: source.count,
        parentId: (context.parentId as string) ?? null,
        selected: false,
        modelName: 'HierarchicalFilter',
        ...(source.children?.values
          ? {
              children: source.children.values.map(child =>
                hierarchicalFilterSchema({
                  ...context,
                  facetId: context.facetId,
                }).parse(child),
              ),
            }
          : {}),
      }),
    )
}
