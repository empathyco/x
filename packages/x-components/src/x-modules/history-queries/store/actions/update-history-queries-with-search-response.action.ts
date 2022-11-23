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
      let historyQueriesHaveChanged = false;
      const newHistoryQueries = state.historyQueries.map(historyQuery => {
        if (historyQuery.query === searchResponse.request.query) {
          historyQuery = {
            ...historyQuery,
            facets: searchResponse.facets,
            results: searchResponse.results,
            totalResults: searchResponse.totalResults
          };
          historyQueriesHaveChanged = true;
        }
        return historyQuery;
      });
      if (historyQueriesHaveChanged) {
        return dispatch('setHistoryQueries', newHistoryQueries);
      }
    }
  };
