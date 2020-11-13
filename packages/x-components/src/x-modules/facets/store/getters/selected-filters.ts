import { Filter } from '@empathy/search-types';
import { isFilterSelected } from '../../../../utils/filters';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.selectedFilters} getter.
 *
 * @param _state - Unused state of the facets module. Added in the JSDoc to avoid ESLint error.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets module.
 * @returns Array of selected filters.
 * @public
 */
export const selectedFilters: FacetsXStoreModule['getters']['selectedFilters'] = (
  _state,
  { flattenedFilters }
): Filter[] => {
  return flattenedFilters.filter(isFilterSelected);
};
