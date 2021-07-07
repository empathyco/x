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
 * Sets the {@link FacetsState.backendFacets | backendFacets}.
 *
 * @public
 */
export const setBackendFacetsWire = wireDispatch('setBackendFacets');

/**
 * Updates the {@link FacetsState.backendFacets | backendFacets}.
 *
 * @public
 */
export const updateBackendFacetsWire = wireDispatch('updateBackendFacets');

/**
 * Sets the {@link FacetsState.frontendFacets | frontendFacets}.
 *
 * @public
 */
export const setFrontendFacetsWire = wireDispatch('setFrontendFacets');

/**
 * Changes the multi-select configuration for a facet.
 *
 * @public
 */
export const setFacetMultiSelect = wireCommit('setFacetMultiSelect');

/**
 * Toggles a {@link @empathyco/x-types#SimpleFilter | SimpleFilter}.
 *
 * @public
 */
export const toggleSimpleFilterWire = wireDispatch('toggleSimpleFilter');

/**
 * Toggles a {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter}.
 *
 * @public
 */
export const toggleHierarchicalFilterWire = wireDispatch('toggleHierarchicalFilter');

/**
 * Toggles a {@link @empathyco/x-types#NumberRangeFilter | NumberRangeFilter}.
 *
 * @public
 */
export const toggleNumberRangeFilterWire = wireDispatch('toggleNumberRangeFilter');

/**
 * Sets {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter} range.
 *
 * @public
 */
export const setEditableNumberRangeFilterRangeWire = wireCommit(
  'setEditableNumberRangeFilterRange'
);

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
 * Wiring configuration for the {@link FacetsXModule | facets module}.
 *
 * @internal
 */
export const facetsWiring = createWiring({
  BackendFacetsChanged: {
    updateBackendFacetsWire
  },
  BackendFacetsProvided: {
    setBackendFacetsWire
  },
  FrontendFacetsChanged: {
    setFrontendFacetsWire
  },
  FacetMultiSelectChanged: {
    setFacetMultiSelect
  },
  UserAcceptedAQuery: {
    setFacetsQuery
  },
  UserClearedQuery: {
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
  UserModifiedEditableNumberRangeFilter: {
    setEditableNumberRangeFilterRangeWire
  },
  UserClickedClearFacetFilters: {
    clearFacetsSelectedFiltersWire
  },
  UserClickedClearAllFilters: {
    clearSelectedFiltersWire
  },
  UserClickedFacetAllFilter: {
    clearFacetSelectedFiltersWire
  }
});
