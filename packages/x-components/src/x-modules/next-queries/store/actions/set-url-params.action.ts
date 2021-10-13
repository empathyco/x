import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link QuerySuggestionsXStoreModule.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 * @public
 */
export const setUrlParams: NextQueriesXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query }
) => {
  if (query) {
    commit('setQuery', query);
  }
};
