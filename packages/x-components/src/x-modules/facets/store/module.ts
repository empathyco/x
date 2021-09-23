import { Facet } from '@empathyco/x-types';
import Vue from 'vue';
import { setUrlParamsFromTheUrl } from './actions/set-filters-from-url.action';
import { facets } from './getters/facets.getter';
import { selectedFiltersByFacet } from './getters/selected-filters-by-facet.getter';
import { selectedFilters } from './getters/selected-filters.getter';
import { FacetGroupEntry, FacetsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the facets module.
 *
 * @internal
 */
export const facetsXStoreModule: FacetsXStoreModule = {
  state: () => ({
    filters: {},
    groups: {},
    query: '',
    facets: {}
  }),
  getters: {
    selectedFilters,
    selectedFiltersByFacet,
    facets
  },
  mutations: {
    setFilter(state, filter) {
      Vue.set(state.filters, filter.id, Object.freeze(filter));
    },
    setFilters(state, filters) {
      filters.forEach(filter => Vue.set(state.filters, filter.id, Object.freeze(filter)));
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
    setQuery(state, query) {
      state.query = query;
    }
  },
  actions: {
    setUrlParamsFromTheUrl
  }
};
