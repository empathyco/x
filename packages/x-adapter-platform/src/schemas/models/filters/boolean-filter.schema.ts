import type { BooleanFilter } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'
import { platformFilterValidator } from './platform-filter.validator'

/**
 * Default implementation for the BooleanFilterSchema.
 *
 * @public
 */
export const booleanFilterSchema = createMutableZodSchema({
  source: platformFilterValidator,
  transform: (source, context): BooleanFilter => ({
    ...defined<Pick<BooleanFilter, 'id' | 'label'>>({ id: source.filter, label: source.value }),
    facetId: context.facetId as string,
    selected: false,
    modelName: 'BooleanFilter',
  }),
})
