import { BooleanFilter } from './boolean-filter.model';
import { Filter } from './filter.model';
import { RangeValue } from './range-value.model';

/**
 * A type of filter used in {@link NumberRangeFacet} and extends from {@link BooleanFilter}.
 * This filter has the particularity that its range property is an object with a range of numbers.
 * The difference with {@link EditableNumberRangeFilter} is that range's values are not editable. There
 * are different NumberRangeFilters within the facet to cover different predefined range options.
 *
 * @public
 */
export interface NumberRangeFilter extends BooleanFilter {
    /** Model name to indicate the filter type. */
    modelName: 'NumberRangeFilter';
    /** Filter range to use in the frontend. */
    range: RangeValue;
}

/**
 * Type guard to check if a filter is a {@link NumberRangeFilter}.
 *
 * @param filter - The filter to check.
 *
 * @public
 */
export function isNumberRangeFilter(filter: Filter): filter is NumberRangeFilter {
    return filter.modelName === 'NumberRangeFilter';
}
