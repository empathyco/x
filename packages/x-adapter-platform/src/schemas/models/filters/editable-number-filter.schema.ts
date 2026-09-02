import type { EditableNumberRangeFilter } from '@empathyco/x-types'
import type { PlatformSliderFilter } from '../../../types/models/facet.model'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the NumberFilterSchema.
 *
 * @public
 */
export const editableNumberFilterSchema = createMutableSchema<
  PlatformSliderFilter,
  EditableNumberRangeFilter
>({
  id: ({ min, max }, context) => {
    const facetId = context?.facetId as string
    const filter = (context?.requestParameters?.filter as string[])?.find(filter =>
      filter.includes(facetId),
    )

    return filter ?? `${facetId}:${min}:${max}`
  },
  facetId: (_, context) => context?.facetId as string,
  selected: () => false,
  modelName: () => 'EditableNumberRangeFilter',
  range: ({ min, max }, context) => {
    const filter = (context?.requestParameters?.filter as string[])?.find(filter =>
      filter.includes(context?.facetId as string),
    )

    const [filterMin, filterMax] = filter?.split(':')[1]?.split('-').map(Number) ?? []

    const minValue = filterMin ?? Number(min)
    const maxValue = filterMax ?? Number(max)

    return {
      min: minValue,
      max: maxValue,
    }
  },
  unit: 'unit',
})
