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
  /** Pre-warming price. */
  futureValue?: number
  /** Whether this result has discount. */
  hasDiscount: boolean
}
