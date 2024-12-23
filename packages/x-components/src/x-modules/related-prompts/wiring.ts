import {
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import {
  NamespacedWireCommit,
  NamespacedWireCommitWithoutPayload
} from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `relatedPrompts` {@link XModuleName | XModule name}.
 */
const moduleName = 'relatedPrompts';

/**
 * WireCommit for {@link RelatedPromptsXModule}.
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);

/**
 * WireCommitWithoutPayload for {@link RelatedPromptsXModule}.
 */
const wireCommitWithoutPayload: NamespacedWireCommitWithoutPayload<typeof moduleName> =
  namespacedWireCommitWithoutPayload(moduleName);

/**
 * WireDispatch for {@link RelatedPromptsXModule}.
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * WireDispatchWithoutPayload for {@link RelatedPromptsXModule}.
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the related prompts state `query`.
 */
const setRelatedPromptsQuery = wireCommit('setQuery');

/**
 * Sets the related prompts state `selectedPrompt`.
 */
const setSelectedPromptWire = wireCommit('setSelectedPrompt');

/**
 * Sets the related prompts state `selectedQuery`.
 */
const setSelectedQueryWire = wireCommit('setSelectedQuery');

/**
 * Sets the related prompts state `query` from url params.
 */
const setRelatedPromptsQueryFromUrl = wireCommit(
  'setQuery',
  ({ eventPayload: { query } }) => query
);

/**
 * Sets the related prompts state `params`.
 */
const setRelatedPromptsExtraParams = wireCommit('setParams');

/**
 * Resets the related prompts state.
 */
const resetRelatedPromptsStateWire = wireCommitWithoutPayload('resetRelatedPromptsState');

/**
 * Fetches and saves the related prompts response.
 */
const fetchAndSaveRelatedPromptsResponseWire = wireDispatch('fetchAndSaveRelatedPrompts');

/**
 * Cancels the fetch and save related prompts response.
 */
const cancelFetchAndSaveSearchResponseWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveRelatedPrompts'
);

/**
 * Wiring configuration for the {@link RelatedPromptsXModule | related prompts module}.
 *
 * @internal
 */
export const relatedPromptsWiring = createWiring({
  ParamsLoadedFromUrl: {
    setRelatedPromptsQueryFromUrl
  },
  UserAcceptedAQuery: {
    setRelatedPromptsQuery
  },
  UserClearedQuery: {
    cancelFetchAndSaveSearchResponseWire,
    resetRelatedPromptsStateWire,
    setRelatedPromptsQuery
  },
  RelatedPromptsRequestUpdated: {
    fetchAndSaveRelatedPromptsResponseWire
  },
  ExtraParamsChanged: {
    setRelatedPromptsExtraParams
  },
  UserSelectedARelatedPrompt: {
    setSelectedPromptWire
  },
  UserSelectedARelatedPromptQuery: {
    setSelectedQueryWire
  }
});
