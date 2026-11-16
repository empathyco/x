import type { SimpleFilter } from '@empathyco/x-types'
import type { PlatformFilterSource } from '../../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'

/**
 * Default implementation for the SimpleFilterSchema.
 *
 * @public
 */
export const simpleFilterSchema = createTransformSchema<PlatformFilterSource, SimpleFilter>({
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
