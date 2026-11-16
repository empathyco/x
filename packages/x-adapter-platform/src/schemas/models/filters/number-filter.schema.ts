import type { NumberRangeFilter } from '@empathyco/x-types'
import type { PlatformFilterSource } from '../../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'
import { mapRange } from './filter.utils'

/**
 * Default implementation for the NumberFilterSchema.
 *
 * @public
 */
export const numberFilterSchema = createMutableZodSchema<PlatformFilterSource, NumberRangeFilter>({
  transform: (source, context): NumberRangeFilter => ({
    ...defined<Pick<NumberRangeFilter, 'id' | 'label' | 'totalResults'>>({
      id: source.filter,
      label: source.value,
      totalResults: source.count,
    }),
    facetId: context.facetId as string,
    selected: false,
    modelName: 'NumberRangeFilter',
    range: mapRange(source.value),
  }),
})
