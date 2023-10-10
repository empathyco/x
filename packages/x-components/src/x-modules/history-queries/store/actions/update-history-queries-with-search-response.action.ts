import { Filter } from '@empathyco/x-types';
import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the
 * {@link HistoryQueriesActions.updateHistoryQueriesWithSearchResponse} action.
 *
 * The matching history query will only be updated on the following scenarios:
 * 1. If it is part of a previous session, not the current one.
 * 2. If its total results count has not been registered yet.
 * 3. If there is a new search response.
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
        let filters: Filter[] = [];
        if (!isCurrentSessionHistoryQuery || historyQuery.totalResults == null || searchResponse) {
          if (searchResponse.request.filters) {
            filters = checkFilters(searchResponse.request.filters);
          }

          const newHistoryQueries = state.historyQueries.slice();
          newHistoryQueries[indexOfHistoryQuery] = {
            ...historyQuery,
            totalResults: searchResponse.totalResults,
            filters: filters
          };
          return dispatch('setHistoryQueries', newHistoryQueries);
        }
      }
    }
  };

// eslint-disable-next-line jsdoc/require-description
/**
 * Take filters from the request and push them into a list.
 *
 * @param requestFilters - Filters from the request.
 *
 * @returns A list of selected filters in the history query.
 *
 */
function checkFilters(requestFilters: Record<string, Filter[]>): Filter[] {
  const filtersApplied: Filter[] = [];
  Object.keys(requestFilters).forEach(key => {
    const facet = requestFilters[key];
    facet.forEach(filter => {
      if (filtersApplied.includes(filter)) {
        const filterIndex = filtersApplied.findIndex(value => value.id === filter.id);
        filtersApplied.splice(filterIndex, 1);
      } else {
        filtersApplied.push(filter);
      }
    });
  });
  return filtersApplied;
}
