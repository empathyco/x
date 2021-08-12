import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';
import { DefaultFacetsService } from './service/facets.service';

/**
 * Wires factory for {@link DefaultFacetsService}.
 */
const wireFacetsService = wireService(DefaultFacetsService.instance);

/**
 * Wires without payload factory for {@link DefaultFacetsService}.
 */
const wireFacetsServiceWithoutPayload = wireServiceWithoutPayload(DefaultFacetsService.instance);

/**
 * WireCommit for {@link FacetsNextXModule}.
 *
 * @internal
 */
const facetsNextWireCommit = namespacedWireCommit('facetsNext');

/**
 * Saves the facets contained in the group, removing the previous ones, and keeping the previous
 * filters selected state.
 *
 * @public
 */
const updateFacetsGroupWire = wireFacetsService('updateFacets');

/**
 * Saves the facets contained in the group, removing the previous ones, and keeping the new filters
 * selected state.
 *
 * @public
 */
const setFacetsGroupWire = wireFacetsService('setFacets');

/**
 * Toggles the selected state of a filter.
 *
 * @public
 */
const toggleFilterWire = wireFacetsService('toggle');

/**
 * Deselects all the filters. Optionally, it can accept a list of facets ids as payload, and it will
 * only deselect the filters from those facets.
 *
 * @public
 */
const clearFiltersWire = wireFacetsService('clearFilters');

/**
 * Deselects all selected filters.
 *
 * @public
 */
const clearAllFiltersWire = wireFacetsServiceWithoutPayload('clearFilters');

/**
 * Selects the filter passed by payload.
 *
 * @public
 */
const selectFilterWire = wireFacetsService('select');

/**
 * Sets the facets state `query`.
 *
 * @public
 */
const setFacetsQuery = facetsNextWireCommit('setQuery');

/**
 * Wiring configuration for the {@link FacetsNextXModule | facets module}.
 *
 * @internal
 */
export const facetsNextWiring = createWiring({
  FacetsGroupChanged: {
    updateFacetsGroupWire
  },
  FacetsGroupProvided: {
    setFacetsGroupWire
  },
  UserClickedANextFilter: {
    toggleFilterWire
  },
  UserClickedClearAllFilters: {
    clearFiltersWire
  },
  UserModifiedEditableNumberRangeNextFilter: {
    selectFilterWire
  },
  UserClickedFacetAllNextFilter: {
    clearFiltersWire
  },
  UserAcceptedAQuery: {
    setFacetsQuery
  },
  UserClearedQuery: {
    setFacetsQuery
  },
  FacetsQueryChanged: {
    clearAllFiltersWire
  }
});
