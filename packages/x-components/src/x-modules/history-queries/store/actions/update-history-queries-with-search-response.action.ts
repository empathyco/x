import { HistoryQuery } from '@empathyco/x-types';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the
 * {@link HistoryQueriesActions.updateHistoryQueriesWithSearchResponse} action.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param searchResponse - The search response to update history queries with.
 *
 * @returns A `void` promise that resolves when the history query finishes updating.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const updateHistoryQueriesWithSearchResponse: HistoryQueriesXStoreModule['actions']['updateHistoryQueriesWithSearchResponse'] =
  ({ state, dispatch }, searchResponse) => {
    if (searchResponse.status === 'success') {
      const historyQueries = state.historyQueries.reduce((result: HistoryQuery[], historyQuery) => {
        if (historyQuery.query === searchResponse.request.query) {
          historyQuery.totalResults = searchResponse.totalResults;
        }
        return [...result, historyQuery];
      }, []);
      return dispatch('setHistoryQueries', historyQueries);
    }
  };
