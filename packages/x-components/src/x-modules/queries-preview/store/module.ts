import Vue from 'vue';
import { QueriesPreviewXStoreModule } from './types';
import { fetchQueryPreview } from './actions/fetch-query-preview.action';
import { fetchAndSaveQueryPreview } from './actions/fetch-and-save-query-preview.action';
import { loadedQueriesPreview } from './getters/loaded-queries-preview.getter';

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
    selectedQueryPreview: {
      query: '',
      extraParams: undefined
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
    }
  },
  actions: {
    fetchQueryPreview,
    fetchAndSaveQueryPreview
  }
};
