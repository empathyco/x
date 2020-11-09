import { Facet, Filter, HierarchicalFacet } from '@empathy/search-types';

/**
 * Checks if a filter is selected.
 *
 * @param filter - The filter to check if it is selected.
 * @returns True when the filter is selected. False otherwise.
 * @public
 */
export const isFilterSelected = (filter: Filter): boolean => !!filter.selected;

/**
 * Checks if a Facet is a {@link @empathy/search-types#HierarchicalFacet | HierarchicalFacet}.
 *
 * @param facet - The facet to check if it is hierarchical.
 * @returns True if it is a `HierarchicalFacet`. False otherwise.
 * @public
 */
export const isHierarchicalFilter = (facet: Facet): facet is HierarchicalFacet =>
  facet.modelName === 'HierarchicalFacet';
