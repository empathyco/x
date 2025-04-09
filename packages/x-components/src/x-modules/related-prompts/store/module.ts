import type { RelatedPromptsXStoreModule } from './types'
import { setQuery } from '../../../store/utils/query.utils'
import { setStatus } from '../../../store/utils/status-store.utils'
import {
  cancelFetchAndSaveRelatedPrompts,
  fetchAndSaveRelatedPrompts,
} from './actions/fetch-and-save-related-prompts.action'
import { fetchRelatedPrompts } from './actions/fetch-related-prompts.action'
import { setUrlParams } from './actions/set-url-params.action'
import { request } from './getters/request.getter'

/**
 * {@link XStoreModule} For the related prompt module.
 *
 * @internal
 */
export const relatedPromptsXStoreModule: RelatedPromptsXStoreModule = {
  state: () => ({
    query: '',
    relatedPrompts: [],
    selectedPrompt: -1,
    selectedQuery: -1,
    status: 'initial',
    params: {},
  }),
  getters: {
    request,
  },
  mutations: {
    setStatus,
    setQuery,
    setParams(state, params) {
      state.params = params
    },
    setRelatedPromptsProducts(state, products) {
      state.relatedPrompts = products
    },
    setSelectedPrompt(state, selectedPrompt) {
      state.selectedPrompt = state.selectedPrompt === selectedPrompt ? -1 : selectedPrompt
    },
    setSelectedQuery(state, selectedQuery) {
      state.selectedQuery = selectedQuery
    },
    resetRelatedPromptsState(state) {
      state.selectedQuery = -1
      state.selectedPrompt = -1
      state.relatedPrompts = []
    },
    resetSelectedPrompt(state) {
      state.selectedPrompt = -1
    },
  },
  actions: {
    fetchRelatedPrompts,
    fetchAndSaveRelatedPrompts,
    cancelFetchAndSaveRelatedPrompts,
    setUrlParams,
  },
}
