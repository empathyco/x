import { BooleanFilter } from './boolean-filter.model';

/**
 * A type of filter used in {@link SimpleFacet} and extends from {@link Filter}.
 * It can be selected or not.
 *
 * @public
 */
export interface SimpleFilter extends BooleanFilter {
    /** Model name to indicate the filter type. */
    modelName: 'SimpleFilter';
}
