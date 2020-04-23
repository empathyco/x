import { getAndSaveNextQueries } from './actions/get-and-save-next-queries.action';
import { getNextQueries } from './actions/get-next-queries.action';
//eslint-disable-next-line max-len
import { setQueryFromLastHistoryQuery } from './actions/set-query-from-last-history-query.action';
import { nextQueries } from './getters/next-queries';
import { request } from './getters/request';
import { NextQueriesXStoreModule } from './types';

/**
 * {@link XStoreModule} For the next-queries module.
 *
 * @internal
 */
export const nextQueriesXStoreModule: NextQueriesXStoreModule = {
  state: () => ({
    query: '',
    nextQueries: [],
    searchedQueries: [],
    config: {
      itemsToRequest: 5,
      hideSessionQueries: true,
      loadOnInit: false
    }
  }),
  getters: {
    request,
    nextQueries
  },
  mutations: {
    setQuery(state, newQuery) {
      state.query = newQuery;
    },
    setNextQueries(state, nextQueries) {
      state.nextQueries = nextQueries;
    },
    setSearchedQueries(state, searchedQueries) {
      state.searchedQueries = searchedQueries;
    }
  },
  actions: {
    getAndSaveNextQueries,
    getNextQueries,
    setQueryFromLastHistoryQuery
  }
};
