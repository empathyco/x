import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring';
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
 * WireDispatchWithOutPayload for {@link FacetsXModule}.
 *
 * @internal
 */
const wireDispatchWithOutPayload = namespacedWireDispatchWithoutPayload(moduleName);

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
 * Toggles a {@link @empathy/search-types#NumberRangeFilter | NumberRangeFilter}.
 *
 * @public
 */
export const toggleNumberRangeFilter = wireDispatch('toggleNumberRangeFilter');

/**
 * Deselects the filters of the provided facets ids.
 *
 * @public
 */
export const clearFacetsSelectedFilters = wireDispatch('clearFacetsSelectedFilters');

/**
 * Deselects the filters of the provided facet id.
 *
 * @public
 */
export const clearFacetSelectedFilters = wireDispatch('clearFacetSelectedFilters');

/**
 * Deselects all the filters.
 *
 * @public
 */
export const clearSelectedFilters = wireDispatchWithOutPayload('clearSelectedFilters');

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
  UserAcceptedAQuery: {
    clearSelectedFilters
  },
  UserClickedASimpleFilter: {
    toggleSimpleFilter
  },
  UserClickedAHierarchicalFilter: {
    toggleHierarchicalFilter
  },
  UserClickedANumberRangeFilter: {
    toggleNumberRangeFilter
  },
  UserClickedClearFacetFilters: {
    clearFacetsSelectedFilters
  },
  UserClickedClearAllFilters: {
    clearSelectedFilters
  },
  UserClickedFacetAllFilter: {
    clearFacetSelectedFilters
  }
});
