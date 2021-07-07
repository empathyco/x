import Vue from 'vue';
import {
  clearFacetSelectedFilters,
  clearFacetsSelectedFilters,
  clearSelectedFilters
} from './actions/clear-selected-filters.action';
import { setBackendFacets } from './actions/set-backend-facets.action';
import { setFrontendFacets } from './actions/set-frontend-facets.action';
import { toggleNumberRangeFilter, toggleSimpleFilter } from './actions/toggle-filter.action';
import { toggleHierarchicalFilter } from './actions/toggle-hierarchical-filter.action';
import { updateBackendFacets } from './actions/update-backend-facets.action';
import { facets } from './getters/facets.getter';
import { flattenedFilters } from './getters/flattened-filters.getter';
import { selectedFiltersByFacet } from './getters/selected-filters-by-facet.getter';
import { selectedFilters } from './getters/selected-filters.getter';
import { FacetsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the facets module.
 *
 * @internal
 */
export const facetsXStoreModule: FacetsXStoreModule = {
  state: () => ({
    config: {
      multiSelect: {}
    },
    backendFacets: {},
    frontendFacets: {},
    query: ''
  }),
  getters: {
    facets,
    flattenedFilters,
    selectedFilters,
    selectedFiltersByFacet
  },
  mutations: {
    setBackendFacets(state, newFacets) {
      state.backendFacets = newFacets;
    },
    setFrontendFacets(state, newFacets) {
      state.frontendFacets = newFacets;
    },
    setFacetMultiSelect(state, { facetId, multiSelect }) {
      Vue.set(state.config.multiSelect, facetId, multiSelect);
    },
    setFilterSelected(_state, { filter, selected }) {
      filter.selected = selected;
    },
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    setEditableNumberRangeFilterRange(_state, { filter, range }) {
      filter.range.min = range.min;
      filter.range.max = range.max;
    }
  },
  actions: {
    clearSelectedFilters,
    clearFacetSelectedFilters,
    clearFacetsSelectedFilters,
    updateBackendFacets,
    setBackendFacets,
    setFrontendFacets,
    toggleSimpleFilter,
    toggleHierarchicalFilter,
    toggleNumberRangeFilter
  }
};
