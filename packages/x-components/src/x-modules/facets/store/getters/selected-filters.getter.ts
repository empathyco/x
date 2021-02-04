import { Filter } from '@empathy/search-types';
import { objectFilter } from '../../../../utils';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.selectedFilters} getter.
 *
 * @param _state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets
 * module.
 *
 * @returns Array of selected filters.
 * @public
 */
export const selectedFilters: FacetsXStoreModule['getters']['selectedFilters'] = (
  _state,
  getters
): Filter[] => {
  const selectedFilters = objectFilter(getters.flattenedFilters, (_, filter) => filter.selected);
  return Object.values(selectedFilters);
};
