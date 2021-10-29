import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 *
 * @public
 */
export const setUrlParams: SearchXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query, page }
) => {
  commit('setQuery', query);
  commit('setPage', page);
};
