import type { HistoryQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link HistoryQueriesGetters.historyQueriesWithResults} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
 * queries module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * history queries module.
 * @returns The history queries that have results at the moment they were requested.
 * @public
 */

export const historyQueriesWithResults: HistoryQueriesXStoreModule['getters']['historyQueriesWithResults'] =
  (state, { historyQueries }) => historyQueries.filter(({ totalResults }) => totalResults !== 0)
