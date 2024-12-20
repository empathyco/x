import { setStatus } from '../../../store/utils/status-store.utils';
import { setQuery } from '../../../store/utils/query.utils';
import { RelatedPromptsXStoreModule } from './types';
import { fetchAndSaveRelatedPrompts } from './actions/fetch-and-save-related-prompts.action';
import { fetchRelatedPrompts } from './actions/fetch-related-prompts.action';
import { request } from './getters/request.getter';

/**
 * {@link XStoreModule} For the related prompt module.
 *
 * @internal
 */
export const relatedPromptsXStoreModule: RelatedPromptsXStoreModule = {
  state: () => ({
    query: '',
    relatedPrompts: {},
    status: 'initial',
    params: {}
  }),
  getters: {
    request
  },
  mutations: {
    setStatus,
    setQuery,
    setParams(state, params) {
      state.params = params;
    },
    setRelatedPromptsProducts(state, { products, query }) {
      state.relatedPrompts[query] = {
        relatedPromptsProducts: products,
        selectedPrompt: -1,
        selectedQuery: -1
      };
    },
    setSelectedPrompt(state, { index, query }) {
      if (state.relatedPrompts[query].selectedPrompt === index) {
        state.relatedPrompts[query].selectedPrompt = -1;
      } else {
        state.relatedPrompts[query].selectedPrompt = index;
      }
    },
    /* setSelectedQuery(state, selectedQuery) {
      state.selectedQuery = selectedQuery;
    },*/
    resetRelatedPromptsState(state) {
      state.relatedPrompts = {};
    } /*
    resetSelectedPrompt(state) {
      state.relatedPrompts = {};
    }*/
  },
  actions: {
    fetchRelatedPrompts,
    fetchAndSaveRelatedPrompts
  }
};
