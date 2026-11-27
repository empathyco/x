import type { ListItem } from '../../utils/types'

/**
 * Model names of the list items that are rendered as a full-width row by the `BaseGrid`.
 *
 * @internal
 */
const FULL_WIDTH_MODEL_NAMES = ['Banner', 'NextQueriesGroup', 'RelatedPromptsGroup']

/**
 * Checks if a list item is rendered as a full-width row in the grid.
 *
 * @param item - The list item to check.
 * @returns `true` if the item takes a whole grid row.
 *
 * @internal
 */
export function isFullWidthListItem(item: ListItem): boolean {
  return (
    FULL_WIDTH_MODEL_NAMES.includes(item.modelName) ||
    (item.modelName === 'VendorBanner' && (item as { position?: number }).position == null)
  )
}

/**
 * Returns the index of the list where a full-width item has to be inserted to start the given
 * grid row.
 *
 * @remarks Regular items take one cell of the grid, and full-width items take a whole row,
 * closing the previous row if it was not complete. The vendor related prompts groups are not
 * counted, so the rows refer to the grid without them. The returned index is always after the
 * vendor related prompts groups already inserted in that row, so they keep their order.
 *
 * @param items - The list items rendered in the grid.
 * @param row - The 1-based grid row to insert the item at.
 * @param columns - The number of columns of the grid.
 * @returns The index to insert the item at, or `-1` if the row is beyond the given items.
 *
 * @internal
 */
export function getIndexForRow(items: ListItem[], row: number, columns: number): number {
  const targetRow = Math.max(row, 1)
  let currentRow = 1
  let cells = 0
  let index = -1

  for (let i = 0; i < items.length && index === -1; i++) {
    const item = items[i]
    if (item.modelName === 'VendorRelatedPromptsGroup') {
      continue
    }
    const isFullWidth = isFullWidthListItem(item)
    if (isFullWidth && cells > 0) {
      currentRow++
      cells = 0
    }
    if (cells === 0 && currentRow >= targetRow) {
      index = i
    } else if (isFullWidth) {
      currentRow++
    } else if (++cells === columns) {
      currentRow++
      cells = 0
    }
  }

  if (index === -1) {
    if (cells > 0) {
      currentRow++
    }
    if (currentRow < targetRow) {
      return -1
    }
    index = items.length
  }
  return index
}
