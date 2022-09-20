import { Facet } from '@empathyco/x-types';
import { UrlParams } from '../../types/url-params';
import { createRawFilters } from '../../utils/filters';
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { filter, mapWire } from '../../wiring/wires.operators';
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
 * Deselects all selected filters only when oldValue is not empty.
 *
 * @public
 */
const clearAllFiltersOnSecondQuery = filter(
  clearAllFiltersWire,
  ({ metadata }) => !!metadata.oldValue
);

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
const setFiltersFromUrl = mapWire(wireFacetsService('select'), ({ filter }: UrlParams) =>
  createRawFilters(filter)
);

/**
 * Saves the preselected filters.
 *
 * @public
 */
const updatePreselectedFilters = wireFacetsService('updatePreselectedFilters');

/**
 * Selects the preselected filters stored in the state.
 *
 * @public
 */
const selectPreselectedFilterWire = wireFacetsService('selectPreselectedFilters');

/**
 * Sets the facets state `query`.
 *
 * @public
 */
const setQuery = wireFacetsService('setQuery');

/**
 * Wiring configuration for the {@link FacetsXModule | facets module}.
 *
 * @internal
 */
export const facetsWiring = createWiring({
  ParamsLoadedFromUrl: {
    // TODO: move this logic to Facets Service
    clearAllFiltersWire,
    setFiltersFromUrl
  },
  PreselectedFiltersProvided: {
    updatePreselectedFilters
  },
  FacetsChanged: {
    updateFacetsGroupWithSearchFacetsWire
  },
  FacetsGroupProvided: {
    setFacetsGroupWire
  },
  UserAcceptedAQuery: {
    setQuery
  },
  FacetsQueryChanged: {
    clearAllFiltersOnSecondQuery
  },
  UserChangedExtraParams: {
    clearAllFiltersWire
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
    clearAllFiltersWire,
    setQuery
  },
  UserClickedOpenX: {
    selectPreselectedFilterWire
  }
});
