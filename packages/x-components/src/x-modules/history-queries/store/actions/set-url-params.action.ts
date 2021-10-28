import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param urlParams - List of params from the url.
 * @public
 */
export const setUrlParams: HistoryQueriesXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query }
) => {
  commit('setQuery', query);
};
