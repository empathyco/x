import type { MapperContext } from '@empathyco/x-adapter'
import type { BooleanFilter } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Returns a Zod schema for mapping a PlatformFilter to a BooleanFilter.
 *
 * @public
 */
export function booleanFilterSchema(context: MapperContext) {
  return z
    .object({
      filter: z.string().optional(),
      value: z.string().optional(),
    })
    .passthrough()
    .transform(
      (source): BooleanFilter => ({
        id: source.filter ?? '',
        label: source.value ?? '',
        facetId: context.facetId as string,
        selected: false,
        modelName: 'BooleanFilter',
      }),
    )
}
