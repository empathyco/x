import Vue from 'vue';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import { getHashFromQueryPreviewItem } from '../utils/get-hash-from-query-preview';
import { QueriesPreviewXStoreModule } from './types';
import { fetchQueryPreview } from './actions/fetch-query-preview.action';
import { fetchAndSaveQueryPreview } from './actions/fetch-and-save-query-preview.action';
import { loadedQueriesPreview } from './getters/loaded-queries-preview.getter';
// eslint-disable-next-line max-len
import { fetchAndSaveQueryPreviewNonCache } from './actions/fetch-and-save-query-preview-non-cache.action';

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
    queriesPreviewCached: {},
    queriesPreviewNonCached: {},
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
      Vue.delete(state.queriesPreviewNonCached, query);
    },
    setParams(state, params) {
      state.params = params;
    },
    setQueryPreviewCached(state, queryPreview) {
      Vue.set(state.queriesPreviewCached, getHashFromQueryPreviewItem(queryPreview), queryPreview);
    },
    setQueryPreviewNonCached(state, queryPreview) {
      Vue.set(
        state.queriesPreviewNonCached,
        getHashFromQueryPreviewItem(queryPreview),
        queryPreview
      );
    },
    setStatus(state, { query, status }) {
      state.queriesPreviewCached[query].status = status;
    },
    setSelectedQueryPreview(state, selectedQueryPreview) {
      state.selectedQueryPreview = selectedQueryPreview;
    },
    setConfig,
    mergeConfig
  },
  actions: {
    fetchQueryPreview,
    fetchAndSaveQueryPreview,
    fetchAndSaveQueryPreviewNonCache
  }
};
