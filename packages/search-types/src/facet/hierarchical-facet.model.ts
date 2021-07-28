import { Facet } from './facet.model';
import { HierarchicalFilter } from './filter/hierarchical-filter.model';

/**
 * Hierarchical facet is a trait for filtering results. It extends from {@link Facet} changes the
 * modelName and uses {@link HierarchicalFilter} as filters.
 */
export interface HierarchicalFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'HierarchicalFacet';
  /** Filters available for the facet. */
  filters: HierarchicalFilter[];
}

/**
 * Type guard to check if a facet is an {@link HierarchicalFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns True if the facet is a {@link HierarchicalFacet}, false otherwise.
 *
 * @public
 */
export function isHierarchicalFacet(facet: Facet): facet is HierarchicalFacet {
  return facet.modelName === 'HierarchicalFacet';
}
