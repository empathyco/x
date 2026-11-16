import type { EditableNumberRangeFilter } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'
import { mapRange, platformFilterValidator } from './platform-filter.validator'

/**
 * Default implementation for the EditableNumberFilterSchema.
 *
 * @public
 */
export const editableNumberFilterSchema = createMutableZodSchema({
  source: platformFilterValidator,
  transform: (source, context): EditableNumberRangeFilter => ({
    ...defined<Pick<EditableNumberRangeFilter, 'id'>>({ id: source.filter }),
    facetId: context.facetId as string,
    selected: false,
    modelName: 'EditableNumberRangeFilter',
    range: mapRange(source.value),
  }),
})
