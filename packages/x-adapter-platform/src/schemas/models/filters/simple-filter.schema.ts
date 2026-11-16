import type { SimpleFilter } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'
import { platformFilterValidator } from './platform-filter.validator'

/**
 * Default implementation for the SimpleFilterSchema.
 *
 * @public
 */
export const simpleFilterSchema = createMutableZodSchema({
  source: platformFilterValidator,
  transform: (source, context): SimpleFilter => ({
    ...defined<Pick<SimpleFilter, 'id' | 'label' | 'totalResults'>>({
      id: source.filter,
      label: source.value,
      totalResults: source.count,
    }),
    facetId: context.facetId as string,
    selected: false,
    modelName: 'SimpleFilter',
  }),
})
