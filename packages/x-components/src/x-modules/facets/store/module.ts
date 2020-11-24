import {
  clearFacetsSelectedFilters,
  clearSelectedFilters
} from './actions/clear-selected-filters.action';
import { setFacets } from './actions/set-facets.action';
import { toggleSimpleFilter } from './actions/toggle-simple-filter.action';
import { flattenedFilters } from './getters/flattened-filters';
import { selectedFilters } from './getters/selected-filters';
import { setFacetMultiSelect } from './mutations/set-facet-multi-select.mutation';
import { setFilterSelected } from './mutations/set-filter-selected.mutation';
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
    facets: {}
  }),
  getters: {
    selectedFilters,
    flattenedFilters
  },
  mutations: {
    setFacets(state, newFacets) {
      state.facets = newFacets;
    },
    setFacetMultiSelect,
    setFilterSelected
  },
  actions: {
    setFacets,
    clearSelectedFilters,
    clearFacetsSelectedFilters,
    toggleSimpleFilter
  }
};
