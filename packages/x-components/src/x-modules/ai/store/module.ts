import type { AiSuggestionQuery, AiSuggestionSearch } from '@empathyco/x-types'
import type { QueryState } from '../../../store'
import type { AiXStoreModule } from './types'
import { isFacetFilter } from '@empathyco/x-types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { groupItemsBy } from '../../../utils/array'
import { UNKNOWN_FACET_KEY } from '../../facets/store/constants'
import { fetchAndSaveAiSuggestionsSearch } from './actions/fetch-and-save-ai-suggestions-search.action'
import { fetchAndSaveAiSuggestions } from './actions/fetch-and-save-ai-suggestions.action'
import { saveOrigin } from './actions/save-origin.action'
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
    selectedFilters: {},
    query: '',
    config: {},
    params: {},
    origin: null,
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
    setSources: (state, sources) => {
      state.sources = sources
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
    setQuery: (state: QueryState, query: string) => {
      state.query = query
    },
    setParams(state, params) {
      state.params = params
    },
    setOrigin(state, origin = null) {
      state.origin = origin
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
    setSelectedFilters(state, selectedFilters) {
      state.selectedFilters = groupItemsBy(selectedFilters, filter =>
        isFacetFilter(filter) ? filter.facetId : UNKNOWN_FACET_KEY,
      )
    },
    setConfig,
    mergeConfig,
  },
  actions: {
    fetchAndSaveAiSuggestions,
    fetchAndSaveAiSuggestionsSearch,
    setUrlParams,
    saveOrigin,
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
    sources: [],
    suggestionsSearch: [],
    suggestionsLoading: false,
    suggestionsSearchLoading: false,
    isNoResults: true,
  }
}
