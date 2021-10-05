import { createRawFilters } from '../../../../utils';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsActions.setFiltersFromUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param urlParams - The url params from the url.
 *
 * @public
 */
export const setFiltersFromUrl: FacetsXStoreModule['actions']['setFiltersFromUrl'] = (
  { commit },
  { filters }
) => {
  const newFilters = filters as (string | number)[];

  if (newFilters) {
    commit('setFilters', createRawFilters(newFilters));
  }
};
