import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesActions.removeFromHistory}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param historyQueryToRemove - The `HistoryQuery` to remove from the history.
 * @returns A `void` promise that resolves when the history queries finishes updating.
 * @public
 */
export const removeFromHistory: HistoryQueriesXStoreModule['actions']['removeFromHistory'] = (
  { state, dispatch },
  historyQueryToRemove
) => {
  const newHistoryQueries = state.historyQueries.filter(
    historyQuery => historyQuery.query !== historyQueryToRemove.query
  );
  return dispatch('setHistoryQueries', newHistoryQueries);
};
