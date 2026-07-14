/**
 * A spannable entity that can span different number of columns in a grid.
 *
 * @public
 */
export interface Spannable {
  /** How many columns the entity should span in the grid. Use 'full' for full-width or a number for specific column count. */
  span?: 'full' | number
}
