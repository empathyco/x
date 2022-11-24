import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the
 * {@link HistoryQueriesActions.updateHistoryQueriesWithSearchResponse} action.
 *
 * The matching history query will only be updated on the following scenarios:
 * 1. If it is part of a previous session, not the current one.
 * 2. If tts total results count has not been registered yet.
 * 3. If its total results count registered is less than the one specified on the search response,
 * meaning that the previous update was part of a filtered request.
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
          const isCurrentSessionHistoryQuery = historyQuery.timestamp > state.sessionTimeStampInMs;
          if (
            !isCurrentSessionHistoryQuery ||
            historyQuery.totalResults == null ||
            historyQuery.totalResults < searchResponse.totalResults
          ) {
            historyQuery = {
              ...historyQuery,
              totalResults: searchResponse.totalResults
            };
            historyQueriesHaveChanged = true;
          }
        }
        return historyQuery;
      });
      if (historyQueriesHaveChanged) {
        return dispatch('setHistoryQueries', newHistoryQueries);
      }
    }
  };
