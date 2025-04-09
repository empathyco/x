import type { HistoryQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link HistoryQueriesActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.commit - commit context
 * @param urlParams - List of params from the url.
 * @param urlParams.query - urlParam query.
 * @public
 */
export const setUrlParams: HistoryQueriesXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query },
) => {
  commit('setQuery', query)
}
