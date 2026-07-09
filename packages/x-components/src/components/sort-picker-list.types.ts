import type { Sort } from '@empathyco/x-types'
import type { VueCSSClasses } from '../../../utils/types'
import type { XEventsTypes } from '../../../wiring/events.types'

/**
 * Sort Picker item options.
 */
export interface SortPickerItem {
  item: Sort
  cssClasses: VueCSSClasses
  event: Partial<XEventsTypes>
}
