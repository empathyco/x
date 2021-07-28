import { HistoryQuery } from '@empathyco/x-types-old';
import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link NextQueriesGetters.nextQueries} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the next
 * queries module.
 * @returns The next queries filtered by the searched queries or not.
 *
 * @public
 */
export const nextQueries: NextQueriesXStoreModule['getters']['nextQueries'] = ({
  nextQueries,
  searchedQueries,
  config
}) => {
  const queriesToFilter = searchedQueries.map((historyQuery: HistoryQuery) => historyQuery.query);
  return config.hideSessionQueries
    ? nextQueries.filter(({ query }) => !queriesToFilter.includes(query))
    : nextQueries;
};
