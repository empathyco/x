import { setStatus } from '../../../store/utils/status.helpers';
import {
  cancelFetchAndSaveNextQueries,
  fetchAndSaveNextQueries
} from './actions/fetch-and-save-next-queries.action';
import { fetchNextQueries } from './actions/fetch-next-queries.action';
import { setQueryFromLastHistoryQuery } from './actions/set-query-from-last-history-query.action';
import { nextQueries } from './getters/next-queries.getter';
import { request } from './getters/request.getter';
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
    status: 'success',
    config: {
      maxItemsToRequest: 20,
      hideSessionQueries: true,
      loadOnInit: true
    },
    params: {}
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
    },
    setStatus,
    setParams(state, params) {
      state.params = params;
    }
  },
  actions: {
    cancelFetchAndSaveNextQueries,
    fetchAndSaveNextQueries,
    fetchNextQueries,
    setQueryFromLastHistoryQuery
  }
};
