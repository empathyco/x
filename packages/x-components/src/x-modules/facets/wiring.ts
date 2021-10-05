import { Facet } from '@empathyco/x-types';
import { namespacedWireDispatch } from '../../wiring/namespaced-wires.factory';
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { mapWire } from '../../wiring/wires.operators';
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
 * WireCommit for {@link FacetsXModule}.
 *
 * @internal
 */
const facetsWireDispatch = namespacedWireDispatch('facets');

/**
 * Saves the facets contained in the `search` group, removing the previous ones, and keeping the
 * previous filters selected state.
 *
 * @public
 */
const updateFacetsGroupWithSearchFacetsWire = mapWire(
  wireFacetsService('updateFacets'),
  (facets: Facet[]) => ({
    facets,
    id: 'search'
  })
);

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
 * Saves the params from the url.
 *
 * @public
 */
export const setFiltersFromUrl = facetsWireDispatch('setFiltersFromUrl');

/**
 * Wiring configuration for the {@link FacetsXModule | facets module}.
 *
 * @internal
 */
export const facetsWiring = createWiring({
  FacetsChanged: {
    updateFacetsGroupWithSearchFacetsWire
  },
  FacetsGroupProvided: {
    setFacetsGroupWire
  },
  UserClickedAFilter: {
    toggleFilterWire
  },
  UserClickedClearAllFilters: {
    clearFiltersWire
  },
  UserModifiedEditableNumberRangeFilter: {
    selectFilterWire
  },
  UserClickedAllFilter: {
    clearFiltersWire
  },
  UserClearedQuery: {
    clearAllFiltersWire
  },
  UrlChanged: {
    setFiltersFromUrl
  }
});
