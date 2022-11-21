import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesGetters.resultHistoryQueries} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
 * queries module.
 *
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * history queries module.
 *
 * @param _
 * @returns The history queries that have results at the moment they were requested.
 *
 * @public
 */
export const resultHistoryQueries: HistoryQueriesXStoreModule['getters']['resultHistoryQueries'] = (
  _,
  { historyQueries }
) => historyQueries.filter(({ totalResults }) => totalResults !== 0);
