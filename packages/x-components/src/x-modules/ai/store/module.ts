import type { AiSuggestionQuery, AiSuggestionSearch } from '@empathyco/x-types'
import type { QueryState } from '../../../store'
import type { AiXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { fetchAiSuggestionsSearch } from './actions/fetch-ai-suggestions-search.action'
import { fetchAiSuggestions } from './actions/fetch-ai-suggestions.action'
import { fetchAndSaveAiSuggestionsSearch } from './actions/fetch-and-save-ai-suggestions-search.action'
import { setUrlParams } from './actions/set-url-params.action'
import { aiQuery as query, aiQuestionsRequest as request } from './getters'
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
    request,
    loading: state => state.suggestionsLoading || state.suggestionsSearchLoading,
    query,
  },
  mutations: {
    /* Streamed fields */
    setResponseText: (state, responseText: string) => {
      state.responseText = state.responseText.concat(responseText)
    },
    setSuggestionText: (state, suggestionText: string) => {
      state.suggestionText = state.suggestionText.concat(suggestionText)
    },
    setQueries: (state, queries: AiSuggestionQuery[]) => {
      state.queries = state.queries.concat(queries)
    },
    setTaggings: (state, taggings) => {
      state.taggings = taggings
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
  },
  actions: {
    fetchAiSuggestions,
    fetchAiSuggestionsSearch,
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
    taggings: [],
    suggestionsSearch: [],
    suggestionsLoading: false,
    suggestionsSearchLoading: false,
  }
}
