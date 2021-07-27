import { Facet } from './facet.model';
import { SimpleFilter } from './filter/simple-filter.model';

/**
 * Simple facet is a trait for filtering results. It extends from {@link Facet}, changes the
 * modelName and uses {@link SimpleFilter} as filters.
 *
 * @public
 */
export interface SimpleFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'SimpleFacet';
  /** Filters available for the facet. */
  filters: SimpleFilter[];
}

/**
 * Type guard to check if a facet is an {@link SimpleFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns True if the facet is a {@link SimpleFacet}, false otherwise.
 *
 * @public
 */
export function isSimpleFacet(facet: Facet): facet is SimpleFacet {
  return facet.modelName === 'SimpleFacet';
}
