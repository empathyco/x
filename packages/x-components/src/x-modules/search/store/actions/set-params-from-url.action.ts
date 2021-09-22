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
  urlParams
) => {
  const newQuery = urlParams.query as string;
  const newPage = urlParams.page as number;

  if (newQuery) {
    commit('setQuery', newQuery);
  }

  if (newPage) {
    commit('setPage', newPage);
  }
};
