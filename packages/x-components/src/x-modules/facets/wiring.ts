import { namespacedWireCommit, namespacedWireDispatch } from '../../wiring';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `facets` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'facets';

/**
 * WireCommit for {@link FacetsXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * WireDispatch for {@link FacetsXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * Sets the facets state `facets`.
 *
 * @public
 */
export const setFacets = wireDispatch('setFacets');

/**
 * Changes the multi-select configuration for a facet.
 *
 * @public
 */
export const setFacetMultiSelect = wireCommit('setFacetMultiSelect');

/**
 * Toggles a {@link @empathy/search-types#SimpleFilter | SimpleFilter}.
 *
 * @public
 */
export const toggleSimpleFilter = wireDispatch('toggleSimpleFilter');

/**
 * Toggles a {@link @empathy/search-types#HierarchicalFilter | HierarchicalFilter}.
 *
 * @public
 */
export const toggleHierarchicalFilter = wireDispatch('toggleHierarchicalFilter');

/**
 * Deselects the filters of the provided facets ids.
 *
 * @public
 */
export const clearFacetsSelectedFilters = wireDispatch('clearFacetsSelectedFilters');

/**
 * Deselects all the filters.
 *
 * @public
 */
export const clearSelectedFilters = wireDispatch('clearSelectedFilters');

/**
 * Wiring configuration for the {@link FacetsXModule | facets module}.
 *
 * @internal
 */
export const facetsWiring = createWiring({
  FacetsChanged: {
    setFacets
  },
  FacetMultiSelectChanged: {
    setFacetMultiSelect
  },
  UserClickedASimpleFilter: {
    toggleSimpleFilter
  },
  UserClickedAHierarchicalFilter: {
    toggleHierarchicalFilter
  },
  UserClickedClearFacetFilters: {
    clearFacetsSelectedFilters
  },
  UserClickedClearAllFilters: {
    clearSelectedFilters
  }
});
