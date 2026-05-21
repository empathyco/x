/**
 * The result price.
 *
 * @public
 */
export interface ResultPrice {
  /** The old value. */
  originalValue?: number | undefined
  /** The current value. */
  value?: number | undefined
  /** Whether this result has a discount. */
  hasDiscount: boolean
}
