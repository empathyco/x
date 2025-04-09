import type { Filter } from '@empathyco/x-types'
import type { InternalSearchResponse } from '../../../search/index'
import type { HistoryQueriesXStoreModule } from '../types'
import { UNKNOWN_FACET_KEY } from '../../../facets/store/constants'

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

export const updateHistoryQueriesWithSearchResponse: HistoryQueriesXStoreModule['actions']['updateHistoryQueriesWithSearchResponse'] =
  async ({ state, dispatch }, searchResponse) => {
    if (searchResponse.status === 'success') {
      const indexOfHistoryQuery = state.historyQueries.findIndex(
        ({ query }) => query === searchResponse.request.query,
      )
      if (indexOfHistoryQuery >= 0) {
        const historyQuery = state.historyQueries[indexOfHistoryQuery]
        const isCurrentSessionHistoryQuery = historyQuery.timestamp > state.sessionTimeStampInMs
        if (!isCurrentSessionHistoryQuery || historyQuery.totalResults == null || searchResponse) {
          const filters = getHistoryQueriesFiltersList(
            searchResponse.facets,
            searchResponse.request.filters,
          )

          const newHistoryQueries = state.historyQueries.slice()
          newHistoryQueries[indexOfHistoryQuery] = {
            ...historyQuery,
            totalResults: searchResponse.totalResults,
            selectedFilters: filters,
          }
          return dispatch('setHistoryQueries', newHistoryQueries)
        }
      }
    }
  }

/**
 * Creates a selected filters list by comparing request filters and response facets.
 * Uses the 'filter.id' to match and merge the objects in a single one with all the keys.
 *
 * @param responseFacets - Facets from the response.
 * @param requestFilters - Filters from the request.
 *
 * @returns A list of selected filters in the history query.
 *
 */
function getHistoryQueriesFiltersList(
  responseFacets: InternalSearchResponse['facets'],
  requestFilters: InternalSearchResponse['request']['filters'],
): Filter[] {
  if (!requestFilters || !responseFacets) {
    return []
  } else {
    return Object.entries(requestFilters).flatMap(([facetId, facetFilters]) => {
      const matchingFacet =
        facetId !== UNKNOWN_FACET_KEY ? responseFacets.find(facet => facet.id === facetId) : null

      return facetFilters.reduce<Filter[]>((accFilters, requestFilter) => {
        const matchingFilter = matchingFacet
          ? matchingFacet.filters.find(filter => filter.id === requestFilter.id)
          : responseFacets
              .flatMap(facet => facet.filters)
              .find(filter => filter.id === requestFilter.id)

        if (matchingFilter) {
          accFilters.push({ ...matchingFilter, selected: requestFilter.selected })
        }

        return accFilters
      }, [])
    })
  }
}
