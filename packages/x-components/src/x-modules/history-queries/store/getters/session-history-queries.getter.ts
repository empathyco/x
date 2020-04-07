import { HistoryQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link HistoryQueriesGetters.sessionHistoryQueries} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
 * queries module.
 * @returns The history queries that have been made in the current session.
 * @public
 */
// eslint-disable-next-line max-len
export const sessionHistoryQueries: HistoryQueriesXStoreModule['getters']['sessionHistoryQueries'] = ({
  sessionTimeStampInMs,
  historyQueries
}) => {
  return historyQueries.filter(historyQuery => historyQuery.timestamp > sessionTimeStampInMs);
};
