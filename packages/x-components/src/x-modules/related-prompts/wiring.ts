import {
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload,
} from '../../wiring/namespaced-wires.factory'
import { filter } from '../../wiring/wires.operators'
import { createWiring } from '../../wiring/wiring.utils'

/** `relatedPrompts` XModule name. */
const moduleName = 'relatedPrompts'
/** WireCommit for RelatedPromptsXModule. */
const wireCommit = namespacedWireCommit(moduleName)
/** WireCommitWithoutPayload for RelatedPromptsXModule. */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload(moduleName)
/** WireDispatch for RelatedPromptsXModule.*/
const wireDispatch = namespacedWireDispatch(moduleName)
/** WireDispatchWithoutPayload for RelatedPromptsXModule. */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName)

/** Sets the related prompts state from URL data. */
const setUrlParams = wireDispatch('setUrlParams')
/** Sets the related prompts state `params`. */
const setExtraParams = wireCommit('setParams')

/** Sets the related prompts state `query`. */
const setRelatedPromptsQuery = wireCommit('setQuery')
/** Sets the related prompts state `query` from the payload. */
const setRelatedPromptsQueryFromPreview = wireCommit(
  'setQuery',
  ({ eventPayload: { query } }) => query,
)
/** Sets the related prompts state `selectedQuery`. */
const setRelatedPromptQuery = wireCommit('setSelectedQuery')
/** Sets the related prompts state `selectedPrompt`. */
const setRelatedPrompt = wireCommit('setSelectedPrompt')
/** Sets the related prompts state `relatedTags`.*/
const setRelatedPromptsRelatedTags = wireCommit('setRelatedPromptsRelatedTags')
/** Fetches and saves the related prompts response. */
const fetchAndSaveRelatedPrompts = wireDispatch('fetchAndSaveRelatedPrompts')
/** Fetches the same request and saves the related prompts response. */
const reloadRelatedPromptsRequestWire = wireDispatch(
  'fetchAndSaveRelatedPrompts',
  ({ getters }) => getters.request,
)
/** Cancels the fetch and save related prompts response. */
const cancelFetchAndSaveRelatedPrompts = wireDispatchWithoutPayload(
  'cancelFetchAndSaveRelatedPrompts',
)

/** Resets the related prompts state. */
const resetRelatedPromptsState = wireCommitWithoutPayload('resetRelatedPromptsState')
/** Resets the selected related prompt number. */
const resetRelatedPrompt = wireCommitWithoutPayload('resetSelectedPrompt')

/**
 * Wiring configuration for the {@link RelatedPromptsXModule | related prompts module}.
 *
 * @internal
 */
export const relatedPromptsWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams,
  },
  ExtraParamsChanged: {
    setExtraParams,
  },
  UserAcceptedAQuery: {
    setRelatedPromptsQuery,
    resetRelatedPrompt,
  },
  UserAcceptedAQueryPreview: {
    setRelatedPromptsQueryFromPreview,
    resetRelatedPrompt,
  },
  UserClearedQuery: {
    cancelFetchAndSaveRelatedPrompts,
    resetRelatedPromptsState,
    setRelatedPromptsQuery,
  },
  RelatedPromptsRequestUpdated: {
    fetchAndSaveRelatedPrompts,
  },
  UserSelectedARelatedPrompt: {
    setRelatedPrompt,
  },
  UserSelectedARelatedPromptQuery: {
    setRelatedPromptQuery,
  },
  SearchRequestChanged: {
    resetRelatedPrompt: filter(
      resetRelatedPrompt,
      // Avoid reset selected prompt just after restored from URL with ParamsLoadedFromUrl event
      ({ store }) => store.state.x.search.origin !== 'url:external',
    ),
  },
  SelectedRelatedTagsChanged: {
    setRelatedPromptsRelatedTags,
  },
  ReloadRelatedPromptsRequested: {
    resetRelatedPromptsState,
    reloadRelatedPromptsRequestWire,
  },
})
