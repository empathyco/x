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
  id: (_, context) => {
    const facetId = context?.facetId as string
    const filter = (context?.requestParameters?.filter as string[])?.find(filter =>
      filter.includes(facetId),
    )

    return filter ?? facetId
  },
  facetId: (_, context) => context?.facetId as string,
  selected: () => false,
  modelName: () => 'EditableNumberRangeFilter',
  range: {
    min: ({ min }) => {
      const minValue = Number(min)
      return Number.isNaN(minValue) ? null : minValue
    },
    max: ({ max }) => {
      const maxValue = Number(max)
      return Number.isNaN(maxValue) ? null : maxValue
    },
  },
  unit: 'unit',
})
