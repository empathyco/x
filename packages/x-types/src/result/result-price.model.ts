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
  /** @deprecated It is not a general purpose field. */
  futureValue?: number
  /** Whether this result has discount. */
  hasDiscount: boolean
}
