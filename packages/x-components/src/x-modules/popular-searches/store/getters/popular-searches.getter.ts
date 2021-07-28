import { HistoryQuery } from '@empathyco/x-types-old';
import { PopularSearchesXStoreModule } from '../types';

/**
 * Default implementation for the {@link PopularSearchesGetters.popularSearches} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the
 * popular searches module.
 * @returns The popular searches, filtered by the searched queries or not, depending of the
 * `hideSessionQueries` config.
 *
 * @public
 */
export const popularSearches: PopularSearchesXStoreModule['getters']['popularSearches'] = ({
  popularSearches,
  searchedQueries,
  config
}) => {
  const queriesToFilter = searchedQueries.map((historyQuery: HistoryQuery) => historyQuery.query);
  return config.hideSessionQueries
    ? popularSearches.filter(({ query }) => !queriesToFilter.includes(query))
    : popularSearches;
};
