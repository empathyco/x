import { setStatus } from '../../../store/utils/status-store.utils';
import { setQuery } from '../../../store/utils/query.utils';
import { RelatedPromptsXStoreModule } from './types';
import {
  cancelFetchAndSaveRelatedPrompts,
  fetchAndSaveRelatedPrompts
} from './actions/fetch-and-save-related-prompts.action';
import { fetchRelatedPrompts } from './actions/fetch-related-prompts.action';
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
    fetchRelatedPrompts,
    fetchAndSaveRelatedPrompts,
    cancelFetchAndSaveRelatedPrompts
  }
};
