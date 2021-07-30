import { isFacetFilter } from '@empathyco/x-types-next';
import { FacetsNextXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsNextGetters.selectedFilters} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 *
 * @returns A list containing the selected filters.
 *
 * @public
 */
export const selectedFilters: FacetsNextXStoreModule['getters']['selectedFilters'] = state =>
  Object.values(state.filters).filter(filter => isFacetFilter(filter) && filter.selected);
