import type { Facet } from '@empathyco/x-types'
import type { FacetGroupEntry, FacetsXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { setQuery } from '../../../store/utils/query.utils'
import { facets } from './getters/facets.getter'
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
    config: {
      filtersStrategyForRequest: 'all',
    },
  }),
  getters: {
    selectedFilters,
    selectedFiltersForRequest,
    selectedFiltersByFacet,
    facets,
  },
  mutations: {
    mutateFilter(state, { filter, newFilterState }) {
      const newFilter = { ...filter, ...newFilterState }
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
  },
  actions: {},
}
