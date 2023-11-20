import Vue from 'vue';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import { QueriesPreviewXStoreModule } from './types';
import { fetchQueryPreview } from './actions/fetch-query-preview.action';
import { fetchAndSaveQueryPreview } from './actions/fetch-and-save-query-preview.action';
import { loadedQueriesPreview } from './getters/loaded-queries-preview.getter';
import { updateQueryPreviewHistory } from './actions/update-query-preview-history.action';

/**
 * {@link XStoreModule} For the `queries-preview` module.
 *
 * @internal
 */
export const queriesPreviewXStoreModule: QueriesPreviewXStoreModule = {
  state: () => ({
    config: {
      maxItemsToRequest: 24
    },
    queriesPreview: {},
    queryPreviewHistory: [],
    selectedQueryPreview: {
      query: '',
      extraParams: undefined,
      filters: undefined
    },
    params: {}
  }),
  getters: { loadedQueriesPreview },
  mutations: {
    clearQueryPreview(state, query) {
      Vue.delete(state.queriesPreview, query);
    },
    setParams(state, params) {
      state.params = params;
    },
    setQueryPreview(state, queryPreview) {
      Vue.set(state.queriesPreview, queryPreview.request.query, queryPreview);
    },
    setStatus(state, { query, status }) {
      state.queriesPreview[query].status = status;
    },
    setSelectedQueryPreview(state, selectedQueryPreview) {
      state.selectedQueryPreview = selectedQueryPreview;
    },
    setConfig,
    mergeConfig,
    setQueryPreviewHistory(state, queryPreview) {
      state.queryPreviewHistory.push(queryPreview);
    },
    removeFromQueryPreviewHistory(state, queryPreviewItem) {
      state.queryPreviewHistory.splice(state.queryPreviewHistory.indexOf(queryPreviewItem), 1);
    }
  },
  actions: {
    fetchQueryPreview,
    fetchAndSaveQueryPreview,
    updateQueryPreviewHistory
  }
};
