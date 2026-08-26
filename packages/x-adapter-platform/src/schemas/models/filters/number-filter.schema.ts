import type { MapperContext } from '@empathyco/x-adapter'
import type { NumberRangeFilter } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Returns a Zod schema for mapping a PlatformFilter to a NumberRangeFilter.
 *
 * @public
 */
export function numberFilterSchema(context: MapperContext) {
  return z
    .object({
      filter: z.string().optional(),
      value: z.string().optional(),
      count: z.number().optional(),
    })
    .passthrough()
    .transform((source): NumberRangeFilter => {
      const min = Number(source.value?.split('-')[0])
      const max = Number(source.value?.split('-')[1])
      return {
        id: source.filter ?? '',
        label: source.value ?? '',
        facetId: context.facetId as string,
        totalResults: source.count,
        selected: false,
        modelName: 'NumberRangeFilter',
        range: {
          min: Number.isNaN(min) ? null : min,
          max: Number.isNaN(max) ? null : max,
        },
      }
    })
}
