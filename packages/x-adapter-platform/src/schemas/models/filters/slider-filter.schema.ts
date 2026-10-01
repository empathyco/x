import type { MapperContext } from '@empathyco/x-adapter'
import type { SliderFilter } from '@empathyco/x-types'
import type { PlatformSliderFilter } from '../../../types/models/facet.model'
import { createMutableSchema } from '@empathyco/x-adapter'

const getFilter = (context: MapperContext | undefined) => {
  if (!context) {
    return undefined
  }

  const facetId = context.facetId as string
  return (context.requestParameters?.filter as string[] | undefined)?.find(filter =>
    filter.startsWith(`${facetId}:`),
  )
}

/**
 * Default implementation for the sliderFilterSchema.
 *
 * @public
 */
export const sliderFilterSchema = createMutableSchema<PlatformSliderFilter, SliderFilter>({
  id: ({ min, max }, context) => {
    const facetId = context?.facetId as string
    const filter = getFilter(context)

    return filter ?? `${facetId}:${min}:${max}`
  },
  facetId: (_, context) => context?.facetId as string,
  selected: () => false,
  modelName: () => 'SliderFilter',
  range: ({ min, max }) => ({
    min: Number(min),
    max: Number(max),
  }),
  selectedRange: (_, context) => {
    const filter = getFilter(context)

    if (!filter) {
      return { min: null, max: null }
    }

    const [, range] = filter.split(':')
    const [min, max] = range.split('-')

    return {
      min: Number(min),
      max: Number(max),
    }
  },

  unit: 'unit',
})
