import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.selectedFilters} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 *
 * @returns A list containing the selected filters.
 *
 * @public
 */
export const selectedFilters: FacetsXStoreModule['getters']['selectedFilters'] = state => {
  const selected = Object.values(state.filters).filter(filter => filter.selected);
  Object.keys(state.stickyFilters).forEach(key => {
    const stickyFilter = state.stickyFilters[key];
    const index = selected.findIndex(filter => filter.id === stickyFilter.id);
    if (index < 0) {
      selected.push(stickyFilter);
    }
  });
  return selected;
};
