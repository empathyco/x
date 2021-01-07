import { Filter } from './filter.model';

/**
 * A type of filter used in {@link NumberRangeFacet} and extends from {@link Filter} , which is used to
 * sift the results. This filter has the particularity that it is value can be a range of numbers.
 *
 * @public
 */
export interface NumberRangeFilter extends Filter {
    /** Model name to indicate the filter type. */
    modelName: 'NumberRangeFilter';
    /** Filter value to use with the API. */
    value: RangeValue;
}

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
