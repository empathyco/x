import { Facet } from '@empathyco/x-types';
import Vue from 'vue';
import { facets } from './getters/facets.getter';
import { selectedFiltersByFacet } from './getters/selected-filters-by-facet.getter';
import { selectedFilters } from './getters/selected-filters.getter';
import { FacetGroupEntry, FacetsConfig, FacetsXStoreModule } from './types';
import { selectedFiltersForRequest } from './getters/selected-filters-for-request.getter';

/**
 * {@link XStoreModule} For the facets module.
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
      filtersStrategyForRequest: 'all'
    }
  }),
  getters: {
    selectedFilters,
    selectedFiltersForRequest,
    selectedFiltersByFacet,
    facets
  },
  mutations: {
    mutateFilter(state, { filter, newFilterState }) {
      const newFilter = Object.assign(filter, newFilterState);
      Vue.set(state.filters, newFilter.id, newFilter);
    },
    setFilters(state, filters) {
      filters.forEach(filter => Vue.set(state.filters, filter.id, filter));
    },
    setPreselectedFilters(state, filters) {
      state.preselectedFilters = filters;
    },
    removeFilter(state, { id }) {
      Vue.delete(state.filters, id);
    },
    removeFilters(state, filters) {
      filters.forEach(({ id }) => Vue.delete(state.filters, id));
    },
    setFacetGroup(state, { facetId, groupId }: FacetGroupEntry) {
      Vue.set(state.groups, facetId, groupId);
    },
    removeFacet(state, { id }) {
      Vue.delete(state.facets, id);
    },
    setFacet(state, facet: Facet) {
      Vue.set(state.facets, facet.id, facet);
    },
    setFacetsConfig(state, config: FacetsConfig) {
      state.config = config;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setStickyFilter(state, filter) {
      if (!state.stickyFilters[filter.id]) {
        Vue.set(state.stickyFilters, filter.id, filter);
      }
    },
    removeStickyFilter(state, filter) {
      Vue.delete(state.stickyFilters, filter.id);
    },
    clearStickyFilters(state) {
      state.stickyFilters = {};
    }
  },
  actions: {}
};
