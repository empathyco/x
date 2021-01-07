import { Filter } from './filter.model';

/**
 * A type of filter used in {@link SimpleFacet} and extends from {@link Filter} , which is used to
 * sift the results.
 *
 * @public
 */
export interface SimpleFilter extends Filter {
    /** Model name to indicate the filter type. */
    modelName: 'SimpleFilter';
    /** Filter value to use with the API. */
    value: string;
}
