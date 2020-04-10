import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesActions.removeQueryFromHistory}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param query - The query to remove from the history.
 * @returns A `void` promise that resolves when the history queries finishes updating.
 * @public
 */
// eslint-disable-next-line max-len
export const removeQueryFromHistory: HistoryQueriesXStoreModule['actions']['removeQueryFromHistory'] = (
  { state, dispatch },
  query
) => {
  const newHistoryQueries = state.historyQueries.filter(
    historyQuery => historyQuery.query !== query
  );
  return dispatch('setHistoryQueries', newHistoryQueries);
};
