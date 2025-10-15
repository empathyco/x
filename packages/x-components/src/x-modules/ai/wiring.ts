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

/** Sets the AI state `query`. */
const setAiQueryWire = wireCommit('setQuery')

/** Fetches the AI suggestions streaming response. */
const fetchAndSaveAiSuggestionsWire = wireDispatch('fetchAndSaveAiSuggestions')

/** Fetches and save the AI suggestions search response. */
const fetchAndSaveAiSuggestionsSearchWire = wireDispatch('fetchAndSaveAiSuggestionsSearch')

/** Sets the AI state `relatedTags`.*/
const setAiRelatedTagsWire = wireCommit('setAiRelatedTags')

/** Resets the related prompts state. */
const resetAiStateWire = wireCommitWithoutPayload('resetAiState')

/** Sets the origin for the AI requests. */
const saveAiOriginWire = wireDispatch('saveOrigin', ({ metadata }) => metadata)

/** Sets the AI state `selectedFilters`. */
const setSelectedFiltersWire = wireCommit('setSelectedFilters')

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
  UserAcceptedAQuery: {
    setAiQueryWire,
  },
  UserClearedQuery: {
    setAiQueryWire,
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
  AiOverviewMounted: {
    saveAiOriginWire,
  },
})
