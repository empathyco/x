import type { BooleanFilter } from '@empathyco/x-types'
import type { PlatformFilterSource } from '../../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'

/**
 * Default implementation for the BooleanFilterSchema.
 *
 * @public
 */
export const booleanFilterSchema = createMutableZodSchema<PlatformFilterSource, BooleanFilter>({
  transform: (source, context): BooleanFilter => ({
    ...defined<Pick<BooleanFilter, 'id' | 'label'>>({ id: source.filter, label: source.value }),
    facetId: context.facetId as string,
    selected: false,
    modelName: 'BooleanFilter',
  }),
})
