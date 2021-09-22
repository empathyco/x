import { SearchBoxXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchBoxActions.setQueryFromUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 * @public
 */
export const setQueryFromUrl: SearchBoxXStoreModule['actions']['setQueryFromUrl'] = (
  { commit, state: { query } },
  urlParams
) => {
  const newQuery = urlParams.query as string;
  if (newQuery) {
    commit('setQuery', newQuery);
  }
};
