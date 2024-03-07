import { setQuery } from '../../../store/utils/query.utils';
import { setStatus } from '../../../store/utils/status-store.utils';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
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
import { query } from './getters/next-queries-query.getter';
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
    relatedTags: [],
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
    nextQueries,
    query
  },
  mutations: {
    setQuery,
    setNextQueries(state, nextQueries) {
      state.nextQueries = nextQueries;
    },
    setSearchedQueries(state, searchedQueries) {
      state.searchedQueries = searchedQueries;
    },
    setRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags;
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
    },
    setConfig,
    mergeConfig
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
