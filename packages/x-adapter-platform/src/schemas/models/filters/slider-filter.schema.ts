import type { MapperContext } from '@empathyco/x-adapter'
import type { SliderFilter } from '@empathyco/x-types'
import type { PlatformSliderFilterSource } from '../../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'

function getFilter(context: MapperContext) {
  const facetId = context.facetId as string
  return (context.requestParameters?.filter as string[] | undefined)?.find(filter =>
    filter.startsWith(`${facetId}:`),
  )
}

function getSelectedRange(filter: string | undefined): SliderFilter['selectedRange'] {
  const match = filter?.split(':')[1].match(/^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/)
  return match ? { min: Number(match[1]), max: Number(match[2]) } : { min: null, max: null }
}

/**
 * Default implementation for the sliderFilterSchema.
 *
 * @public
 */
export const sliderFilterSchema = createTransformSchema<PlatformSliderFilterSource, SliderFilter>({
  transform: ({ min, max, unit }, context): SliderFilter => {
    const filter = getFilter(context)
    return {
      id: filter ?? `${context.facetId as string}:${min}-${max}`,
      facetId: context.facetId as string,
      selected: false,
      modelName: 'SliderFilter',
      range: { min: Number(min), max: Number(max) },
      selectedRange: getSelectedRange(filter),
      ...defined<Pick<SliderFilter, 'unit'>>({ unit }),
    }
  },
})
