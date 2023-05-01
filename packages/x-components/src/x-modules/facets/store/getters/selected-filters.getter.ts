import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.selectedFilters} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets'
 * module.
 *
 * @returns A list containing the selected filters.
 *
 * @public
 */
export const selectedFilters: FacetsXStoreModule['getters']['selectedFilters'] = state => {
  const selectedFilters = Object.values(state.filters).filter(filter => filter.selected);
  Object.keys(state.stickyFilters).forEach(stickyFilterId => {
    const isSelected = selectedFilters.some(selectedFilter => selectedFilter.id === stickyFilterId);
    if (!isSelected) {
      selectedFilters.push(state.stickyFilters[stickyFilterId]);
    }
  });
  return selectedFilters;
};
