import type { HistoryQuery } from '@empathyco/x-types'
import type { GettersClass } from '../../../../store/getters.types'
import type { HistoryQueriesState, HistoryQueriesXStoreModule } from '../types'
import { normalizeString } from '../../../../utils/normalize'

/**
 * Class implementation for the {@link HistoryQueriesGetters.historyQueries} getter.
 *
 * @public
 */
export class HistoryQueriesGetter implements GettersClass<HistoryQueriesXStoreModule> {
  /**
   * Default implementation for the {@link HistoryQueriesGetters.historyQueries} getter.
   *
   * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
   * queries module.
   * @param state.query - query state.
   * @param state.historyQueries - historyQueries state.
   * @param state.config - config state.
   * @returns The filtered subset of queries, matching with the current query.
   */
  historyQueries({ query, historyQueries, config }: HistoryQueriesState): HistoryQuery[] {
    return query
      ? historyQueries.filter(
          this.searchInHistoryQueries(normalizeString(query), config.hideIfEqualsQuery),
        )
      : historyQueries
  }

  /**
   * Creates a function for searching in the history queries array the items that match the current
   * query.
   *
   * @param normalizedQuery - The normalized query for search into the array.
   * @param hideIfEqualsQuery - If `true`, removes items that are exactly like the current query.
   * @returns A filter function for searching into the array of history queries with the provided
   * params.
   * @internal
   */
  protected searchInHistoryQueries(
    normalizedQuery: string,
    hideIfEqualsQuery: boolean,
  ): (historyQuery: HistoryQuery) => boolean {
    return (historyQuery: HistoryQuery) => {
      const normalizedHistoryQuery = normalizeString(historyQuery.query)
      const matchesQuery = normalizedHistoryQuery.includes(normalizedQuery)
      return hideIfEqualsQuery
        ? matchesQuery && normalizedHistoryQuery !== normalizedQuery
        : matchesQuery
    }
  }
}

const historyQueriesGetter = new HistoryQueriesGetter()

/**
 * History Queries getter.
 *
 * @public
 */
export const historyQueries = historyQueriesGetter.historyQueries.bind(historyQueriesGetter)
