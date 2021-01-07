import { Facet } from './facet.model';
import { SimpleFilter } from './filter/simple-filter.model';

/**
 * Simple facet is a trait for filtering results. It extends from {@link Facet}, changes the modelName and
 * uses {@link SimpleFilter} as filters.
 *
 * @public
 */
export interface SimpleFacet extends Facet {
    /** Model name to indicate the facet type. */
    modelName: 'SimpleFacet';
    /** Filters available for the facet. */
    filters: SimpleFilter[];
}
