import type { ListItem, VueCSSClasses } from '../utils/types'

/**
 * The type returned by the gridItems function. Basically it's a list of items with its CSS
 * classes and a slotName.
 */
export interface GridItem {
  slotName: string
  item: ListItem
  cssClass: VueCSSClasses
}
