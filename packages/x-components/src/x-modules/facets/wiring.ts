import type { Facet } from '@empathyco/x-types'
import type { UrlParams } from '../../types/url-params'
import type { XEventPayload } from '../../wiring/index'
import { createRawFilters } from '../../utils/filters'
import {
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
} from '../../wiring'
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory'
import { filter, mapWire } from '../../wiring/wires.operators'
import { createWiring } from '../../wiring/wiring.utils'
import { DefaultFacetsService } from './service/facets.service'

/**
 * `facets` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'facets'

/**
 * WireCommit for {@link FacetsXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName)

/**
 * WireCommitWithoutPayload for {@link FacetsXModule}.
 *
 * @internal
 */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload(moduleName)

/**
 * WireDispatch for {@link FacetsXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName)

/**
 * Wires factory for {@link DefaultFacetsService}.
 */
const wireFacetsService = wireService(DefaultFacetsService.instance)

/**
 * Wires without payload factory for {@link DefaultFacetsService}.
 */
const wireFacetsServiceWithoutPayload = wireServiceWithoutPayload(DefaultFacetsService.instance)

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
    id: 'search',
  }),
)

/**
 * Saves the facets contained in the group, removing the previous ones, and keeping the new filters
 * selected state.
 *
 * @public
 */
const setFacetsGroupWire = wireFacetsService('setFacets')

/**
 * Toggles the selected state of a filter.
 *
 * @public
 */
const toggleFilterWire = wireFacetsService('toggle')

/**
 * Deselects all the filters. Optionally, it can accept a list of facets ids as payload, and it will
 * only deselect the filters from those facets.
 *
 * @public
 */
const clearFiltersWire = wireFacetsService('clearFilters')

/**
 * Deselects all selected filters.
 *
 * @public
 */
const clearAllFiltersWire = wireFacetsServiceWithoutPayload('clearFilters')

/**
 * Deselects all selected filters but keep the sticky ones.
 *
 * @internal
 */
const clearAllFiltersButStickyWire = wireFacetsService('clearFiltersWithMetadata', {
  metadata: {
    keepSticky: true,
  },
})

/**
 * Deselects all selected filters only when oldValue is not empty.
 *
 * @public
 */
const clearAllFiltersOnSecondQuery = filter(
  clearAllFiltersButStickyWire,
  ({ metadata }) => !!metadata.oldValue,
)

/**
 * Selects the filter passed by payload.
 *
 * @public
 */
const selectFilterWire = wireFacetsService('select')

/**
 * Saves the params from the url.
 *
 * @public
 */
const setFiltersFromUrl = mapWire(wireFacetsService('select'), ({ filter }: UrlParams) =>
  createRawFilters(filter),
)

/**
 * Saves the preselected filters.
 *
 * @public
 */
const updatePreselectedFilters = wireFacetsService('updatePreselectedFilters')

/**
 * Selects the preselected filters stored in the state.
 *
 * @public
 */
const selectPreselectedFilterWire = wireFacetsService('selectPreselectedFilters')

/**
 * Sets the facets state `query`.
 *
 * @public
 */
const setQuery = wireFacetsService('setQuery')

const setQueryFromUrlWire = wireCommit(
  'setQuery',
  ({ eventPayload }: { eventPayload: UrlParams }) => eventPayload.query,
)

/**
 * Removes all the sticky filters from the state.
 *
 * @internal
 */
const clearStickyFilters = filter<XEventPayload<'SearchResponseChanged'>>(
  wireCommitWithoutPayload('clearStickyFilters'),
  ({ eventPayload }) => {
    return eventPayload.totalResults === 0
  },
)

/**
 * Sets the filters of the facets module from a queryPreview's filters.
 *
 * @public
 */
export const setSelectedFiltersFromPreview = wireCommit(
  'setFilters',
  ({ eventPayload: { filters } }) => (filters ? createRawFilters(filters) : []),
)

/**
 * Sets the filters of the facets module from a selectedHistoryQuery's filters.
 *
 * @public
 */
export const setFiltersFromHistoryQueries = wireCommit(
  'setFilters',
  ({ eventPayload: { selectedFilters } }) => selectedFilters ?? [],
)

/**
 * Sets the query of the facets module from a queryPreview.
 *
 * @public
 */
export const setQueryFromPreview = wireCommit('setQuery', ({ eventPayload: { query } }) => query)

/**
 * Sets the facets state `params`.
 *
 * @public
 */
export const setFacetsExtraParams = wireCommit('setParams')

/**
 * Sets the search state `selectedFiltersDictionary`.
 *
 * @public
 */
export const setSelectedFiltersDictionaryWire = wireCommit('setSelectedFiltersDictionary')

/**
 * Requests and stores the facets response.
 *
 * @public
 */
export const fetchAndSaveFacetsResponseWire = wireDispatch('fetchAndSaveFacetsResponse')

/**
 * Filtered version of fetchAndSaveFacetsResponseWire that only executes when separateFacets are enabled.
 *
 * @internal
 */
const fetchAndSaveFacetsResponseWireIfEnabled = filter(
  fetchAndSaveFacetsResponseWire,
  ({ store }) => !!store.state.x.facets.params.separateFacets,
)

/**
 * Wiring configuration for the {@link FacetsXModule | facets module}.
 *
 * @internal
 */
export const facetsWiring = createWiring({
  ParamsLoadedFromUrl: {
    // TODO: move this logic to Facets Service
    clearAllFiltersWire,
    setQueryFromUrlWire,
    setFiltersFromUrl,
  },
  PreselectedFiltersProvided: {
    updatePreselectedFilters,
  },
  FacetsChanged: {
    updateFacetsGroupWithSearchFacetsWire,
  },
  FacetsGroupProvided: {
    setFacetsGroupWire,
  },
  UserAcceptedAQuery: {
    setQuery,
  },
  FacetsQueryChanged: {
    clearAllFiltersOnSecondQuery,
  },
  UserChangedExtraParams: {
    clearAllFiltersButStickyWire,
  },
  UserClickedAFilter: {
    toggleFilterWire,
  },
  UserClickedClearAllFilters: {
    clearFiltersWire,
  },
  UserModifiedEditableNumberRangeFilter: {
    selectFilterWire,
  },
  UserClickedAllFilter: {
    clearFiltersWire,
  },
  UserClearedQuery: {
    clearAllFiltersButStickyWire,
    setQuery,
  },
  UserClickedOpenX: {
    selectPreselectedFilterWire,
  },
  SearchResponseChanged: {
    clearStickyFilters,
  },
  UserAcceptedAQueryPreview: {
    setQueryFromPreview,
    setSelectedFiltersFromPreview,
  },
  UserSelectedAHistoryQuery: {
    setFiltersFromHistoryQueries,
  },
  ExtraParamsChanged: {
    setFacetsExtraParams,
  },
  UserOpenedFacetsAside: {
    fetchAndSaveFacetsResponseWireIfEnabled,
  },
  FacetsRequestUpdated: {
    fetchAndSaveFacetsResponseWireIfEnabled,
  },
  SelectedFiltersForRequestChanged: {
    setSelectedFiltersDictionaryWire,
  },
})
