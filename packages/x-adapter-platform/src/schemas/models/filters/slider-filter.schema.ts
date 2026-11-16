import type { MapperContext } from '@empathyco/x-adapter'
import type { SliderFilter } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
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

const boundary = z.union([z.string(), z.number()])

/**
 * Default implementation for the sliderFilterSchema.
 *
 * @public
 */
export const sliderFilterSchema = createMutableZodSchema({
  source: z.looseObject({
    min: boundary,
    max: boundary,
    unit: z.optional(z.custom<SliderFilter['unit']>(unit => typeof unit === 'string')),
  }),
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
