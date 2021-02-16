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
 * Sets the facets state `query`.
 *
 * @public
 */
export const setFacetsQuery = wireCommit('setQuery');

/**
 * Sets the facets state `facets`.
 *
 * @public
 */
export const setFacetsWire = wireDispatch('setFacets');

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
export const toggleSimpleFilterWire = wireDispatch('toggleSimpleFilter');

/**
 * Toggles a {@link @empathy/search-types#HierarchicalFilter | HierarchicalFilter}.
 *
 * @public
 */
export const toggleHierarchicalFilterWire = wireDispatch('toggleHierarchicalFilter');

/**
 * Toggles a {@link @empathy/search-types#NumberRangeFilter | NumberRangeFilter}.
 *
 * @public
 */
export const toggleNumberRangeFilterWire = wireDispatch('toggleNumberRangeFilter');

/**
 * Deselects the filters of the provided facets ids.
 *
 * @public
 */
export const clearFacetsSelectedFiltersWire = wireDispatch('clearFacetsSelectedFilters');

/**
 * Deselects the filters of the provided facet id.
 *
 * @public
 */
export const clearFacetSelectedFiltersWire = wireDispatch('clearFacetSelectedFilters');

/**
 * Deselects all the filters.
 *
 * @public
 */
export const clearSelectedFiltersWire = wireDispatchWithOutPayload('clearSelectedFilters');

/**
 * Changes the configuration to handle the selected state of the filters only locally in the store
 * state, or to allow a external source to modify the selected filters.
 *
 * @public
 */
export const setIgnoreNewFiltersSelected = wireCommit('setIgnoreNewFiltersSelected');

/**
 * Wiring configuration for the {@link FacetsXModule | facets module}.
 *
 * @internal
 */
export const facetsWiring = createWiring({
  FacetsChanged: {
    setFacetsWire
  },
  FacetMultiSelectChanged: {
    setFacetMultiSelect
  },
  UserAcceptedAQuery: {
    setFacetsQuery
  },
  FacetsQueryChanged: {
    clearSelectedFiltersWire
  },
  UserClickedASimpleFilter: {
    toggleSimpleFilterWire
  },
  UserClickedAHierarchicalFilter: {
    toggleHierarchicalFilterWire
  },
  UserClickedANumberRangeFilter: {
    toggleNumberRangeFilterWire
  },
  UserClickedClearFacetFilters: {
    clearFacetsSelectedFiltersWire
  },
  UserClickedClearAllFilters: {
    clearSelectedFiltersWire
  },
  UserClickedFacetAllFilter: {
    clearFacetSelectedFiltersWire
  },
  IgnoreNewFiltersSelectedConfigChanged: {
    setIgnoreNewFiltersSelected
  }
});
