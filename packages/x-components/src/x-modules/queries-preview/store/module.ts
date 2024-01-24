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
    clearQueryPreview(state, queryPreviewHash) {
      Vue.delete(state.queriesPreview, queryPreviewHash);
    },
    setParams(state, params) {
      state.params = params;
    },
    setQueryPreviewCached(state, queryPreview) {
      Vue.set(state.queriesPreview, getHashFromQueryPreviewItem(queryPreview), queryPreview);
    },
    setStatus(state, { queryPreviewHash, status }) {
      state.queriesPreview[queryPreviewHash].status = status;
    },
    setSelectedQueryPreview(state, selectedQueryPreview) {
      state.selectedQueryPreview = selectedQueryPreview;
    },
    setConfig,
    mergeConfig,
    addQueryPreviewInstance(state, queryPreviewHash: string) {
      if (state.queriesPreview[queryPreviewHash]) {
        state.queriesPreview[queryPreviewHash].instances += 1;
      }
    },
    removeQueryPreviewInstance(
      state,
      { queryPreviewHash, cache }: { queryPreviewHash: string; cache: boolean }
    ) {
      if (state.queriesPreview[queryPreviewHash]) {
        state.queriesPreview[queryPreviewHash].instances -= 1;

        if (!cache && state.queriesPreview[queryPreviewHash].instances === 0) {
          Vue.delete(state.queriesPreview, queryPreviewHash);
        }
      }
    }
  },
  actions: {
    fetchQueryPreview,
    fetchAndSaveQueryPreview
  }
};
