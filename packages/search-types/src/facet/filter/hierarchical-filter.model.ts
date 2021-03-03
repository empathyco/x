import { BooleanFilter } from './boolean-filter.model';
import { Filter } from './filter.model';

/**
 * A type of filter used in {@link HierarchicalFacet} and extends from {@link BooleanFilter}.
 * This filter has the particularity that it has recursive children.
 *
 * @public
 */
export interface HierarchicalFilter extends BooleanFilter {
    /** Model name to indicate the filter type. */
    modelName: 'HierarchicalFilter';
    /** An unique id used to reference the parent filter or null if it hasn't. */
    parentId: Filter['id'] | null;
    /** Descendants filters. */
    children: this[];
}
