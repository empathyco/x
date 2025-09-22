import type { AiSuggestionQuery, AiSuggestionSearch } from '@empathyco/x-types'
import type { QueryState } from '../../../store'
import type { AiXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { fetchAndSaveAiSuggestionsSearch } from './actions/fetch-and-save-ai-suggestions-search.action'
import { fetchAndSaveAiSuggestions } from './actions/fetch-and-save-ai-suggestions.action'
import { setUrlParams } from './actions/set-url-params.action'
import {
  aiQuery as query,
  aiSuggestionsRequest as suggestionsRequest,
  aiSuggestionsSearchRequest as suggestionsSearchRequest,
} from './getters'
/**
 * {@link XStoreModule} For the ai module.
 *
 * @internal
 */
export const aiXStoreModule: AiXStoreModule = {
  state: () => ({
    ...resettableAiState(),
    query: '',
    config: {},
    params: {},
    relatedTags: [],
  }),
  getters: {
    suggestionsRequest,
    suggestionsSearchRequest,
    query,
  },
  mutations: {
    /* Streamed fields */
    setResponseText: (state, responseText: string) => {
      state.responseText = responseText
    },
    setSuggestionText: (state, suggestionText: string) => {
      state.suggestionText = suggestionText
    },
    setQueries: (state, queries: AiSuggestionQuery[]) => {
      state.queries = queries
    },
    setTagging: (state, tagging) => {
      state.tagging = tagging
    },
    /* END Streamed fields */
    setSuggestionsSearch: (state, suggestionsSearch: AiSuggestionSearch[]) => {
      state.suggestionsSearch = suggestionsSearch
    },
    setSuggestionsLoading: (state, value) => {
      state.suggestionsLoading = value
    },
    setSuggestionsSearchLoading: (state, value) => {
      state.suggestionsSearchLoading = value
    },
    setConfig,
    mergeConfig,
    setQuery: (state: QueryState, query: string) => {
      state.query = query
    },
    setParams(state, params) {
      state.params = params
    },
    resetAiState(state) {
      Object.assign(state, resettableAiState())
    },
    setAiRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags
    },
    setIsNoResults(state, isNoResults: boolean) {
      state.isNoResults = isNoResults
    },
  },
  actions: {
    fetchAndSaveAiSuggestions,
    fetchAndSaveAiSuggestionsSearch,
    setUrlParams,
  },
}

/**
 * Function to return the "resettable" part of the state. This will be used in the `resetState`
 * mutation to reset to the initial state.
 *
 * @returns The "resettable" part of the {@link AiState}.
 *
 * @internal
 */
function resettableAiState() {
  return {
    responseText: '',
    suggestionText: '',
    queries: [],
    tagging: undefined,
    suggestionsSearch: [],
    suggestionsLoading: false,
    suggestionsSearchLoading: false,
    isNoResults: true,
  }
}
