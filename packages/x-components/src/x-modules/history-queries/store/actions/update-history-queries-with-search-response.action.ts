import { Filter } from '@empathyco/x-types';
import { HistoryQueriesXStoreModule } from '../types';
import { InternalSearchResponse } from '../../../search/index';

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
        if (!isCurrentSessionHistoryQuery || historyQuery.totalResults == null || searchResponse) {
          const filters = createHistoryQueriesFiltersList(searchResponse.facets);

          const newHistoryQueries = state.historyQueries.slice();
          newHistoryQueries[indexOfHistoryQuery] = {
            ...historyQuery,
            totalResults: searchResponse.totalResults,
            selectedFilters: filters
          };
          return dispatch('setHistoryQueries', newHistoryQueries);
        }
      }
    }
  };

/**
 * Take facets from the response and push the selected filters into a list.
 *
 * @param responseFacets - Facets from the response.
 *
 * @returns A list of selected filters in the history query.
 *
 */
export function createHistoryQueriesFiltersList(
  responseFacets: InternalSearchResponse['facets']
): Filter[] {
  return responseFacets
    ? Object.values(responseFacets).reduce((accFilters: Filter[], facet) => {
        facet.filters.forEach(filter => {
          return filter.selected ? accFilters.push(filter) : [];
        });
        return accFilters;
      }, [])
    : [];
}
