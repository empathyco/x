import type { VueCSSClasses } from '../../utils/types'
import type { XEventsTypes } from '../../wiring'

export interface ColumnPickerItem {
  column: number
  cssClasses: VueCSSClasses
  events: Partial<XEventsTypes>
  isSelected: boolean
}
