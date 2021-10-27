import { SearchBoxXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchBoxActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 * @public
 */
export const setUrlParams: SearchBoxXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query }
) => {
  commit('setQuery', query);
};
