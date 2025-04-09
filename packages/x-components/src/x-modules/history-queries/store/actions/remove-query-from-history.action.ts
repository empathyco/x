import type { HistoryQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link HistoryQueriesActions.removeFromHistory}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.state - state context.
 * @param context.dispatch - dispatch context.
 * @param historyQueryToRemove - The `HistoryQuery` to remove from the history.
 * @returns A `void` promise that resolves when the history queries finishes updating.
 * @public
 */
export const removeFromHistory: HistoryQueriesXStoreModule['actions']['removeFromHistory'] = async (
  { state, dispatch },
  historyQueryToRemove,
) => {
  const newHistoryQueries = state.historyQueries.filter(
    historyQuery => historyQuery.query !== historyQueryToRemove.query,
  )
  return dispatch('setHistoryQueries', newHistoryQueries)
}
