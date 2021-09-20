import {
  namespacedWireCommit,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * WireCommit for {@link UrlXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('url');

/**
 * WireDispatch for {@link UrlXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload('url');

/**
 * Sets the URL config.
 *
 * @public
 */
export const setUrlConfigWire = wireCommit('setUrlConfig');

/**
 * Sets the URL config.
 *
 * @public
 */
export const setRelatedTagsWire = wireCommit('setRelatedTags');

/**
 * Updates the URL.
 *
 * @public
 */
export const updateUrl = wireDispatchWithoutPayload('updateUrl');

/**
 * Updates the store state from the URL.
 *
 * @public
 */
export const updateStoreUrl = wireDispatchWithoutPayload('updateStoreFromUrl');

/**
 * Sets the query of the url module.
 *
 * @public
 */
export const setQuery = wireCommit('setQuery');

/**
 * Wiring configuration for the {@link UrlXModule | url module}.
 *
 * @internal
 */
export const urlWiring = createWiring({
  UrlConfigProvided: {
    setUrlConfigWire
  },
  UserAcceptedAQuery: {
    setQuery
  },
  UserClearedQuery: {
    setQuery
  },
  UrlStateChanged: {
    updateUrl
  },
  DocumentLoaded: {
    updateStoreUrl
  },
  DocumentHistoryChanged: {
    updateStoreUrl
  },
  SelectedRelatedTagsChanged: {
    setRelatedTagsWire
  }
});
