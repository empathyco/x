import { setQuery } from '../../../store/utils/query.utils';
import { setStatus } from '../../../store/utils/status-store.utils';
import {
  cancelFetchAndSaveNextQueries,
  fetchAndSaveNextQueries
} from './actions/fetch-and-save-next-queries.action';
import { fetchNextQueries } from './actions/fetch-next-queries.action';
import { setQueryFromLastHistoryQuery } from './actions/set-query-from-last-history-query.action';
import { setUrlParams } from './actions/set-url-params.action';
import { fetchNextQueryPreview } from './actions/fetch-next-query-preview.action';
import { fetchAndSaveNextQueryPreview } from './actions/fetch-and-save-next-query-preview.action';
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
    status: 'initial',
    config: {
      maxItemsToRequest: 20,
      hideSessionQueries: true,
      loadOnInit: true,
      maxPreviewItemsToRequest: 8
    },
    params: {},
    resultsPreview: {}
  }),
  getters: {
    request,
    nextQueries
  },
  mutations: {
    setQuery,
    setNextQueries(state, nextQueries) {
      state.nextQueries = nextQueries;
    },
    setSearchedQueries(state, searchedQueries) {
      state.searchedQueries = searchedQueries;
    },
    setStatus,
    setParams(state, params) {
      state.params = params;
    },
    setResultsPreview(state, resultsPreview) {
      state.resultsPreview = { ...state.resultsPreview, ...resultsPreview };
    },
    resetResultsPreview(state) {
      state.resultsPreview = {};
    }
  },
  actions: {
    cancelFetchAndSaveNextQueries,
    fetchAndSaveNextQueries,
    fetchNextQueries,
    setQueryFromLastHistoryQuery,
    setUrlParams,
    fetchNextQueryPreview,
    fetchAndSaveNextQueryPreview
  }
};
