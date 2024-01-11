import Vue from 'vue';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import { getHashFromQueryPreviewItem } from '../utils/get-hash-from-query-preview';
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
    setQueryPreviewCached(state, queryPreview) {
      Vue.set(state.queriesPreview, getHashFromQueryPreviewItem(queryPreview), queryPreview);
    },
    setStatus(state, { query, status }) {
      state.queriesPreview[query].status = status;
    },
    setSelectedQueryPreview(state, selectedQueryPreview) {
      state.selectedQueryPreview = selectedQueryPreview;
    },
    setConfig,
    mergeConfig,
    addQueryPreviewInstance(state, query: string) {
      state.queriesPreview[query].instances += 1;
    },
    removeQueryPreviewInstance(state, { query, cache }: { query: string; cache: boolean }) {
      state.queriesPreview[query].instances -= 1;
      if (!cache && state.queriesPreview[query].instances === 0) {
        Vue.delete(state.queriesPreview, query);
      }
    }
  },
  actions: {
    fetchQueryPreview,
    fetchAndSaveQueryPreview
  }
};
