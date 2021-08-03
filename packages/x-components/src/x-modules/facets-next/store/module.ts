import Vue from 'vue';
import { filtersByFacet } from './getters/filters-by-facet.getter';
import { selectedFilters } from './getters/selected-filters.getter';
import { FacetGroupEntry, FacetsNextXStoreModule } from './types';

/**
 * {@link XStoreModule} For the facets module.
 *
 * @internal
 */
export const facetsNextXStoreModule: FacetsNextXStoreModule = {
  state: () => ({
    filters: {},
    groups: {}
  }),
  getters: {
    selectedFilters,
    filtersByFacet
  },
  mutations: {
    addFilter(state, filter) {
      Vue.set(state.filters, filter.id, filter);
    },
    removeFilter(state, { id }) {
      Vue.delete(state.filters, id);
    },
    setFacetGroup(state, { facetId, groupId }: FacetGroupEntry) {
      Vue.set(state.groups, facetId, groupId);
    }
  },
  actions: {}
};
