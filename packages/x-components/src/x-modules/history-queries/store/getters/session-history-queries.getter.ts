import type { HistoryQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link HistoryQueriesGetters.sessionHistoryQueries} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
 * queries module.
 * @param state.sessionTimeStampInMs - sessionTimeStampInMs state.
 * @param state.historyQueries - historyQueries state.
 * @returns The history queries that have been made in the current session.
 * @public
 */
export const sessionHistoryQueries: HistoryQueriesXStoreModule['getters']['sessionHistoryQueries'] =
  ({ sessionTimeStampInMs, historyQueries }) => {
    return historyQueries.filter(historyQuery => historyQuery.timestamp > sessionTimeStampInMs)
  }
