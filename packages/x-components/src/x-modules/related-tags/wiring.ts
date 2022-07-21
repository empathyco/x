import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit, NamespacedWireDispatch } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `relatedTags` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'relatedTags';
/**
 * WireCommit for {@link RelatedTagsXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);
/**
 * WireDispatch for {@link RelatedTagsXModule}.
 *
 * @internal
 */
const wireDispatch: NamespacedWireDispatch<typeof moduleName> = namespacedWireDispatch(moduleName);
/**
 * WireDispatchWithoutPayload for {@link RelatedTagsXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the related tags state `query`.
 *
 * @public
 */
export const setRelatedTagsQuery = wireCommit('setQuery');

/**
 * Sets the related tags state `params`.
 *
 * @public
 */
export const setRelatedTagsExtraParams = wireCommit('setParams');

/**
 * Requests and stores the related tags.
 *
 * @public
 */
export const fetchAndSaveRelatedTagsWire = wireDispatch('fetchAndSaveRelatedTags');

/**
 * Cancels the {@link RelatedTagsActions.fetchAndSaveRelatedTags} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveRelatedTagsWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveRelatedTags'
);

/**
 * Sets the selected related tags.
 *
 * @public
 */
export const toggleRelatedTagWire = wireDispatch('toggleRelatedTag');

/**
 * Clear the selected related tags.
 *
 * @public
 */
export const clearSelectedRelatedTags = wireCommit('setSelectedRelatedTags', []);

/**
 * Clear the related tags query.
 *
 * @public
 */
export const clearRelatedTagsQuery = wireCommit('setQuery', '');

/**
 * Saves the params from the url.
 *
 * @public
 */
export const setUrlParamsWire = wireDispatch('setUrlParams');

/**
 * Wiring configuration for the {@link RelatedTagsXModule | related tags module}.
 *
 * @internal
 */
export const relatedTagsWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParamsWire
  },
  UserAcceptedAQuery: {
    setRelatedTagsQuery,
    clearSelectedRelatedTags
  },
  UserPickedARelatedTag: {
    toggleRelatedTagWire
  },
  UserChangedExtraParams: {
    clearSelectedRelatedTags
  },
  RelatedTagsRequestChanged: {
    fetchAndSaveRelatedTagsWire
  },
  UserClearedQuery: {
    cancelFetchAndSaveRelatedTagsWire,
    clearRelatedTagsQuery,
    clearSelectedRelatedTags
  },
  ExtraParamsChanged: {
    setRelatedTagsExtraParams
  },
  UserClickedCloseX: {
    clearRelatedTagsQuery
  },
  UserClickedOutOfMainModal: {
    clearRelatedTagsQuery
  }
});
