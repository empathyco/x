import {
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch
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
 * Resets the related prompts state `query`.
 */
const resetRelatedPromptsQueryWire = wireCommit('setQuery', '');

/**
 * Sets the related prompts state `selectedPrompt`.
 */
const setSelectedPromptWire = wireCommit('setSelectedPrompt');

/**
 * Sets the related prompts state `query` from url params.
 */
const setRelatedPromptsQueryFromUrl = wireDispatch(
  'fetchAndSaveRelatedPrompts',
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
 * Wiring configuration for the {@link RelatedPromptsXModule | related prompts module}.
 *
 * @internal
 */
export const relatedPromptsWiring = createWiring({
  ParamsLoadedFromUrl: {
    setRelatedPromptsQueryFromUrl
  },
  UserAcceptedAQuery: {
    fetchAndSaveRelatedPromptsResponseWire
  },
  UserClearedQuery: {
    resetRelatedPromptsStateWire,
    resetRelatedPromptsQueryWire
  },
  RelatedPromptsCustomQueryProvider: {
    fetchAndSaveRelatedPromptsResponseWire
  },
  ExtraParamsChanged: {
    setRelatedPromptsExtraParams
  },
  UserSelectedARelatedPrompt: {
    setSelectedPromptWire
  }
});
