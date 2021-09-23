import { createRawFilters, Dictionary } from '../../../../utils';
import { UrlParamValue } from '../../../url';
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
export const setUrlParamsFromTheUrl: FacetsXStoreModule['actions']['setUrlParamsFromTheUrl'] = (
  { commit },
  { query, filters }: Dictionary<UrlParamValue>
) => {
  const newQuery = query as string;
  const newFilters = filters as string[];

  if (newQuery) {
    commit('setQuery', newQuery);
  }

  if (newFilters) {
    const filters = createRawFilters(newFilters);
    commit('setFilters', filters);
  }
};
