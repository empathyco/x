import { Filter } from '@empathyco/x-types';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the
 * {@link HistoryQueriesActions.updateHistoryQueriesWithSearchResponse} action.
 *
 * The matching history query will only be updated on the following scenarios:
 * 1. If it is part of a previous session, not the current one.
 * 2. If its total results count has not been registered yet.
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
      const indexOfHistoryQuery = state.historyQueries.findIndex(
        ({ query }) => query === searchResponse.request.query
      );
      if (indexOfHistoryQuery >= 0) {
        const historyQuery = state.historyQueries[indexOfHistoryQuery];
        const isCurrentSessionHistoryQuery = historyQuery.timestamp > state.sessionTimeStampInMs;
        if (
          !isCurrentSessionHistoryQuery ||
          historyQuery.totalResults == null ||
          historyQuery.totalResults !== searchResponse.totalResults
        ) {
          const filtersApplied: Filter[] = [];
          if (searchResponse.request.filters) {
            Object.keys(searchResponse.request.filters).forEach(key => {
              const facet = searchResponse.request.filters![key];
              facet.forEach(filter => {
                if (filtersApplied.includes(filter)) {
                  const filterIndex = filtersApplied.findIndex(value => value.id === filter.id);
                  filtersApplied.splice(filterIndex, 1);
                } else {
                  filtersApplied.push(filter);
                }
              });
            });
          }

          const newHistoryQueries = state.historyQueries.slice();
          newHistoryQueries[indexOfHistoryQuery] = {
            ...historyQuery,
            totalResults: searchResponse.totalResults,
            filters: filtersApplied
          };
          return dispatch('setHistoryQueries', newHistoryQueries);
        }
      }
    }
  };
