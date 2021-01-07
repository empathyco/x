import { Filter } from './filter.model';

/**
 * A type of filter used in {@link HierarchicalFacet} and extends from {@link Filter} , which is used to
 * sift the results. This filter has the particularity that it has more children that you can use to filter the results.
 *
 * @public
 */
export interface HierarchicalFilter extends Filter {
    /** Model name to indicate the filter type. */
    modelName: 'HierarchicalFilter';
    /** An unique id used to reference the parent filter or null if it hasn't. */
    parentId: string | null;
    /** Descendants filters. */
    children: this[];
    /** Filter value to use with the API. */
    value: string;
}
