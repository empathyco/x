import type { SliderFilter } from '@empathyco/x-types'
import type { PlatformSliderFilter } from '../../../types/models/facet.model'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the sliderFilterSchema.
 *
 * @public
 */
export const sliderFilterSchema = createMutableSchema<PlatformSliderFilter, SliderFilter>({
  id: ({ min, max }, context) => {
    const facetId = context?.facetId as string
    const filter = (context?.requestParameters?.filter as string[])?.find(filter =>
      filter.includes(facetId),
    )

    return filter ?? `${facetId}:${min}:${max}`
  },
  facetId: (_, context) => context?.facetId as string,
  selected: () => false,
  modelName: () => 'SliderFilter',
  range: ({ min, max }) => {
    const minValue = Number(min)
    const maxValue = Number(max)

    return {
      min: minValue,
      max: maxValue,
    }
  },
  unit: 'unit',
})
