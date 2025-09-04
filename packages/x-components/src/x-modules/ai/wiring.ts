import {
  createWiring,
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
} from '../../wiring'

/** `ai` XModule name. */
const moduleName = 'ai'
/** WireCommit for AiXModule. */
const wireCommit = namespacedWireCommit(moduleName)
/** WireCommitWithoutPayload for AiXModule. */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload(moduleName)
/** WireDispatch for AiXModule.*/
const wireDispatch = namespacedWireDispatch(moduleName)

/** Sets the ai state from URL data. */
const setUrlParams = wireDispatch('setUrlParams')
/** Sets the ai state `params`. */
const setExtraParams = wireCommit('setParams')

/** Sets the ai state `query`. */
const setAiQuery = wireCommit('setQuery')

/** Fetches the AI suggestions streaming response. */
const fetchAndSaveAiSuggestions = wireDispatch('fetchAndSaveAiSuggestions')

/** Fetches and save the ai suggestions search response. */
const fetchAndSaveAiSuggestionsSearch = wireDispatch('fetchAndSaveAiSuggestionsSearch')

/** Sets the ai state `relatedTags`.*/
const setAiRelatedTags = wireCommit('setAiRelatedTags')

/** Resets the related prompts state. */
const resetAiState = wireCommitWithoutPayload('resetAiState')

/**
 *  Wiring configuration for the {@link AiXModule | AI module}.
 *
 * @internal
 */
export const aiWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams,
  },
  ExtraParamsChanged: {
    setExtraParams,
  },
  UserAcceptedAQuery: {
    setAiQuery,
    resetAiState,
  },
  UserClearedQuery: {
    setAiQuery,
    resetAiState,
  },
  AiSuggestionsRequestUpdated: {
    fetchAndSaveAiSuggestions,
  },
  AiSuggestionsSearchRequestUpdated: {
    fetchAndSaveAiSuggestionsSearch,
  },
  SelectedRelatedTagsChanged: {
    setAiRelatedTags,
  },
})
