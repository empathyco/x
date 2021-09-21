import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.setQueryFromUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
export const setQueryFromUrl: SearchXStoreModule['actions']['setQueryFromUrl'] = (
  { commit },
  urlParams
) => {
  const query = urlParams.query as string;
  if (query) {
    commit('setQuery', query);
  }
};
