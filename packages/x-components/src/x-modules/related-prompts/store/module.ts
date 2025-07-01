import type { RelatedPromptsXStoreModule } from './types'
import { setQuery } from '../../../store/utils/query.utils'
import { setStatus } from '../../../store/utils/status-store.utils'
import {
  cancelFetchAndSaveRelatedPrompts,
  fetchAndSaveRelatedPrompts,
} from './actions/fetch-and-save-related-prompts.action'
import { fetchRelatedPrompts } from './actions/fetch-related-prompts.action'
import { setUrlParams } from './actions/set-url-params.action'
import { query } from './getters/related-prompts-query.getter'
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
    relatedPromptsFiltered: [],
    selectedPrompt: -1,
    selectedQuery: -1,
    status: 'initial',
    params: {},
    relatedTags: [],
  }),
  getters: {
    request,
    query,
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
    setFilteredRelatedPromptsProducts(state, products) {
      state.relatedPromptsFiltered = products
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
      state.relatedPromptsFiltered = []
    },
    resetSelectedPrompt(state) {
      state.selectedPrompt = -1
    },
    setRelatedPromptsRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags
    },
  },
  actions: {
    fetchRelatedPrompts,
    fetchAndSaveRelatedPrompts,
    cancelFetchAndSaveRelatedPrompts,
    setUrlParams,
  },
}
