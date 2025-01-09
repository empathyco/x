import { setStatus } from '../../../store/utils/status-store.utils';
import { setQuery } from '../../../store/utils/query.utils';
import { RelatedPromptsXStoreModule } from './types';
import { fetchAndSaveRelatedPrompts } from './actions/fetch-and-save-related-prompts.action';
import { fetchRelatedPrompts } from './actions/fetch-related-prompts.action';

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
  getters: {},
  mutations: {
    setStatus,
    setQuery,
    setParams(state, params) {
      state.params = params;
    },
    setRelatedPromptsProducts(state, { products, query }) {
      state.relatedPrompts[query] = {
        relatedPromptsProducts: products,
        selectedPrompt: ''
      };
    },
    setSelectedPrompt(state, { promptId, query }) {
      if (state.relatedPrompts[query].selectedPrompt === promptId) {
        state.relatedPrompts[query].selectedPrompt = '';
      } else {
        state.relatedPrompts[query].selectedPrompt = promptId;
      }
    },
    resetRelatedPromptsState(state) {
      state.relatedPrompts = {};
    }
  },
  actions: {
    fetchRelatedPrompts,
    fetchAndSaveRelatedPrompts
  }
};
