import Vue from 'vue';
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
    selectedFilters() {
      return [];
    },
    filtersByFacet() {
      return {};
    }
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
