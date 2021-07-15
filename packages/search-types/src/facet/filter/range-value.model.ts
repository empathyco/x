/**
 * A numeric range filter value.
 *
 * @public
 */
export interface RangeValue {
    /** The minimum value allowed. `null` means unset. */
    min: number | null;
    /** The maximum value allowed. `null` means unset. */
    max: number | null;
}
