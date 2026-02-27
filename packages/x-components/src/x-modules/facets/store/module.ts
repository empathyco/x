import type { Facet } from '@empathyco/x-types'
import type { FacetGroupEntry, FacetsXStoreModule } from './types'
import { isFacetFilter } from '@empathyco/x-types'
import { setStatus } from '../../../store'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { setQuery } from '../../../store/utils/query.utils'
import { groupItemsBy } from '../../../utils/array'
import { UNKNOWN_FACET_KEY } from '../../facets/store/constants'
import {
  cancelFetchAndSaveFacetsResponse,
  fetchAndSaveFacetsResponse,
} from './actions/fetch-and-save-facets-response.action'
import { fetchFacetsResponse } from './actions/fetch-facets-response.action'
import { saveOrigin } from './actions/save-origin.action'
import { facets } from './getters/facets.getter'
import { request } from './getters/request.getter'
import { selectedFiltersByFacet } from './getters/selected-filters-by-facet.getter'
import { selectedFiltersForRequest } from './getters/selected-filters-for-request.getter'
import { selectedFilters } from './getters/selected-filters.getter'

/**
 * {@link XStoreModule} For the facets' module.
 *
 * @internal
 */
export const facetsXStoreModule: FacetsXStoreModule = {
  state: () => ({
    query: '',
    filters: {},
    groups: {},
    facets: {},
    preselectedFilters: [],
    stickyFilters: {},
    origin: null,
    params: {},
    config: {
      filtersStrategyForRequest: 'all',
    },
    status: 'initial',
    rawFacets: [],
    selectedFiltersDictionary: {},
  }),
  getters: {
    facets,
    request,
    selectedFilters,
    selectedFiltersForRequest,
    selectedFiltersByFacet,
  },
  mutations: {
    mutateFilter(state, { filter, newFilterState }) {
      const newFilter = Object.assign(filter, newFilterState)
      state.filters[newFilter.id] = newFilter
    },
    setFilters(state, filters) {
      filters.forEach(filter => (state.filters[filter.id] = filter))
    },
    setPreselectedFilters(state, filters) {
      state.preselectedFilters = filters
    },
    removeFilter(state, { id }) {
      delete state.filters[id]
    },
    removeFilters(state, filters) {
      filters.forEach(({ id }) => delete state.filters[id])
    },
    setFacetGroup(state, { facetId, groupId }: FacetGroupEntry) {
      state.groups[facetId] = groupId
    },
    removeFacet(state, { id }) {
      delete state.facets[id]
    },
    setFacet(state, facet: Facet) {
      state.facets[facet.id] = facet
    },
    setConfig,
    mergeConfig,
    setQuery,
    setStatus,
    setStickyFilter(state, filter) {
      if (!state.stickyFilters[filter.id]) {
        state.stickyFilters[filter.id] = filter
      }
    },
    removeStickyFilter(state, filter) {
      delete state.stickyFilters[filter.id]
    },
    clearStickyFilters(state) {
      state.stickyFilters = {}
    },
    setOrigin(state, origin = null) {
      state.origin = origin
    },
    setParams(state, params) {
      state.params = params
    },
    setRawFacets(state, rawFacets) {
      state.rawFacets = rawFacets
    },
    setSelectedFiltersDictionary(state, selectedFilters) {
      state.selectedFiltersDictionary = groupItemsBy(selectedFilters, filter =>
        isFacetFilter(filter) ? filter.facetId : UNKNOWN_FACET_KEY,
      )
    },
  },
  actions: {
    fetchFacetsResponse,
    fetchAndSaveFacetsResponse,
    cancelFetchAndSaveFacetsResponse,
    saveOrigin,
  },
}
