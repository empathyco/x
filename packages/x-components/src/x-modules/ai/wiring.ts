import type { InternalSearchResponse } from '../search/index'
import {
  createWiring,
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
} from '../../wiring'

/** AI XModule name. */
const moduleName = 'ai'
/** WireCommit for AiXModule. */
const wireCommit = namespacedWireCommit(moduleName)
/** WireCommitWithoutPayload for AiXModule. */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload(moduleName)
/** WireDispatch for AiXModule.*/
const wireDispatch = namespacedWireDispatch(moduleName)

/** Sets the AI state from URL data. */
const setUrlParamsWire = wireDispatch('setUrlParams')
/** Sets the AI state `params`. */
const setExtraParamsWire = wireCommit('setParams')

/** Resets the AI state `query`. */
const resetAiQueryWire = wireCommit('setQuery', '')

/** Sets the AI state `query`. */
const setAiQueryWire = wireCommit(
  'setQuery',
  ({ eventPayload: { request } }: { eventPayload: InternalSearchResponse }) => request.query,
)

/** Fetches the AI suggestions streaming response. */
const fetchAndSaveAiSuggestionsWire = wireDispatch('fetchAndSaveAiSuggestions')

/** Fetches and save the AI suggestions search response. */
const fetchAndSaveAiSuggestionsSearchWire = wireDispatch('fetchAndSaveAiSuggestionsSearch', true)

/** Sets the AI state `relatedTags`.*/
const setAiRelatedTagsWire = wireCommit('setAiRelatedTags')

/** Resets the related prompts state. */
const resetAiStateWire = wireCommitWithoutPayload('resetAiState')

/** Sets the origin for the AI requests. */
const saveAiOriginWire = wireDispatch('saveOrigin', ({ metadata }) => metadata)

/** Sets the AI state `selectedFilters`. */
const setSelectedFiltersWire = wireCommit('setSelectedFilters')

/** Resets the AI state `searchTotalResults`. */
const resetSearchTotalResultsWire = wireCommit('setSearchTotalResults', 0)

/** Sets the AI state `searchTotalResults`. */
const setSearchTotalResultsWire = wireCommit(
  'setSearchTotalResults',
  ({ eventPayload }: { eventPayload: { totalResults: number } }) => eventPayload.totalResults,
)

/**
 *  Wiring configuration for the {@link AiXModule | AI module}.
 *
 * @internal
 */
export const aiWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParamsWire,
  },
  ExtraParamsChanged: {
    setExtraParamsWire,
  },
  UserClearedQuery: {
    resetAiQueryWire,
    resetSearchTotalResultsWire,
  },
  AiSuggestionsRequestUpdated: {
    resetAiStateWire,
    fetchAndSaveAiSuggestionsWire,
  },
  AiSuggestionsSearchRequestUpdated: {
    fetchAndSaveAiSuggestionsSearchWire,
  },
  SelectedRelatedTagsChanged: {
    setAiRelatedTagsWire,
  },
  SelectedFiltersForRequestChanged: {
    setSelectedFiltersWire,
  },
  AiComponentMounted: {
    saveAiOriginWire,
  },
  SearchResponseChanged: {
    setAiQueryWire,
    setSearchTotalResultsWire,
  },
})
