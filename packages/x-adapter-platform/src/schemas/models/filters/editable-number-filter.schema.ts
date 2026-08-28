import type { MapperContext } from '@empathyco/x-adapter'
import type { EditableNumberRangeFilter } from '@empathyco/x-types'
import { z } from 'zod'

/**
 * Returns a Zod schema for mapping a PlatformFilter to an EditableNumberRangeFilter.
 *
 * @public
 */
export function editableNumberFilterSchema(context: MapperContext) {
  return z
    .object({
      filter: z.string().optional(),
      value: z.string().optional(),
    })
    .passthrough()
    .transform((source): EditableNumberRangeFilter => {
      const min = Number(source.value?.split('-')[0])
      const max = Number(source.value?.split('-')[1])
      return {
        id: source.filter ?? '',
        facetId: context.facetId as string,
        selected: false,
        modelName: 'EditableNumberRangeFilter',
        range: {
          min: Number.isNaN(min) ? null : min,
          max: Number.isNaN(max) ? null : max,
        },
      }
    })
}
