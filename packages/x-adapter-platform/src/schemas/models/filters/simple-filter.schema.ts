import type { MapperContext } from '@empathyco/x-adapter'
import type { SimpleFilter } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Returns a Zod schema for mapping a PlatformFilter to a SimpleFilter.
 *
 * @public
 */
export function simpleFilterSchema(context: MapperContext) {
  return z
    .object({
      filter: z.string().optional(),
      value: z.string().optional(),
      count: z.number().optional(),
    })
    .passthrough()
    .transform(
      (source): SimpleFilter => ({
        id: source.filter ?? '',
        label: source.value ?? '',
        facetId: context.facetId as string,
        totalResults: source.count,
        selected: false,
        modelName: 'SimpleFilter',
      }),
    )
}
