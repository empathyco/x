import type { EditableNumberRangeFilter } from '@empathyco/x-types'
import type { PlatformFilterSource } from '../../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../../utils'
import { mapRange } from './filter.utils'

/**
 * Default implementation for the EditableNumberFilterSchema.
 *
 * @public
 */
export const editableNumberFilterSchema = createMutableZodSchema<
  PlatformFilterSource,
  EditableNumberRangeFilter
>({
  transform: (source, context): EditableNumberRangeFilter => ({
    ...defined<Pick<EditableNumberRangeFilter, 'id'>>({ id: source.filter }),
    facetId: context.facetId as string,
    selected: false,
    modelName: 'EditableNumberRangeFilter',
    range: mapRange(source.value),
  }),
})
