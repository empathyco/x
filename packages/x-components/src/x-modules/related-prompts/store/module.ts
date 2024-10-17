import { setStatus } from '../../../store/utils/status-store.utils';
import { setQuery } from '../../../store/utils/query.utils';
import { RelatedPromptsXStoreModule } from './types';
import {
  cancelFetchAndSaveRelatedPromptsResponse,
  fetchAndSaveRelatedPromptsResponse
} from './actions/fetch-and-save-related-prompts-response.action';
import { fetchRelatedPromptsResponse } from './actions/fetch-related-prompts-response.action';
import { request } from './getters/request.getter';

export const relatedPromptsXStoreModule: RelatedPromptsXStoreModule = {
  state: () => ({
    query: '',
    relatedPrompts: [],
    status: 'initial'
  }),
  getters: {
    request
  },
  mutations: {
    setStatus,
    setQuery,
    setRelatedPromptsProducts(state, products) {
      state.relatedPrompts = products;
    },
    resetRelatedPromptsState(state) {
      state.relatedPrompts = [];
    }
  },
  actions: {
    fetchAndSaveRelatedPromptsResponse,
    fetchRelatedPromptsResponse,
    cancelFetchAndSaveRelatedPromptsResponse
  }
};
