import { Facet } from './facet.model';
import { HierarchicalFilter } from './filter/hierarchical-filter.model';

/**
 * Hierarchical facet is a trait for filtering results. It extends from {@link Facet} changes the modelName and
 * uses {@link HierarchicalFilter} as filters.
 *
 * @public
 */
export interface HierarchicalFacet extends Facet {
    /** Model name to indicate the facet type. */
    modelName: 'HierarchicalFacet';
    /** Filters available for the facet. */
    filters: HierarchicalFilter[];
}
