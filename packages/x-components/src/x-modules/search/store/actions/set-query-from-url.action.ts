import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.setQueryFromUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 *
 * @public
 */
export const setQueryFromUrl: SearchXStoreModule['actions']['setQueryFromUrl'] = (
  { commit },
  { query }
) => {
  if (query) {
    commit('setQuery', query as string);
  }
};
