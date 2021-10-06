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
  { commit },
  { query }
) => {
  const newQuery = query as string;
  if (query) {
    commit('setQuery', newQuery);
  }
};
