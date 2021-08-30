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
export const selectedFilters: FacetsXStoreModule['getters']['selectedFilters'] = state =>
  Object.values(state.filters).filter(filter => filter.selected);
