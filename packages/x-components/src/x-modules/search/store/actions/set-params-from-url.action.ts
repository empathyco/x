import { createRawFilters } from '../../../../utils';
import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.setParamsFromUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 *
 * @public
 */
export const setParamsFromUrl: SearchXStoreModule['actions']['setParamsFromUrl'] = (
  { commit },
  { query, page, filters }
) => {
  const newQuery = query as string;
  const newPage = page as number;
  const newFilters = filters as (string | number)[];

  if (newQuery) {
    commit('setQuery', newQuery);
  }

  if (newPage) {
    commit('setPage', newPage);
  }

  if (newFilters) {
    commit('setSelectedFilters', createRawFilters(newFilters));
  }
};
