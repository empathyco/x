import { createRawFilters } from '../../../../utils';
import { UrlParams } from '../../../url/store/types';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsActions.setUrlParamsFromTheUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param urlParams - The url params from the url.
 *
 * @public
 */
export const setFiltersFromUrl: FacetsXStoreModule['actions']['setFiltersFromUrl'] = (
  { commit },
  { filters }: UrlParams
) => {
  const newFilters = filters as string[];

  if (newFilters) {
    const filters = createRawFilters(newFilters);
    commit('setFilters', filters);
  }
};
