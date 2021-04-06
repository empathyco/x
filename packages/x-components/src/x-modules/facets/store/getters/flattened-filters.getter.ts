import { arrayToObject } from '../../../../utils';
import { extractFilters } from '../../../../utils/filters';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.flattenedFilters} getter.
 *
 * @param _state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets.
 *
 * @returns Array of filters.
 *
 * @public
 */
export const flattenedFilters: FacetsXStoreModule['getters']['flattenedFilters'] = (
  _state,
  getters
) => {
  return arrayToObject(extractFilters(getters.facets), 'id');
};
