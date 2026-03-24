/**
 * The result price.
 *
 * @public
 */
export interface ResultPrice {
  /** The old value. */
  originalValue: number
  /** The current value. */
  value: number
  /** Whether this result has a discount. */
  hasDiscount: boolean
}
