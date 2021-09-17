import { namespacedWireDispatchWithoutPayload } from '../../wiring';
import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * WireCommit for {@link UrlXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('url');

/**
 * WireDispatch without payload for {@link UrlXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatchWithoutPayload('url');

/**
 * Sets the URL config.
 *
 * @public
 */
export const setUrlConfigWire = wireCommit('setUrlConfig');

/**
 * Sets the URL related tags.
 *
 * @public
 */
export const setRelatedTagsWire = wireCommit('setRelatedTags');

/**
 * Updates the Url.
 *
 * @public
 */
export const updateUrlWire = wireDispatch('updateUrl');

/**
 * Updates the store from the Url.
 *
 * @public
 */
export const updateStoreFromUrlWire = wireDispatch('updateStoreFromUrl');

/**
 * Wiring configuration for the {@link UrlXModule | url module}.
 *
 * @internal
 */
export const urlWiring = createWiring({
  UrlConfigProvided: {
    setUrlConfigWire
  },
  UrlStateChanged: {
    updateUrlWire
  },
  SelectedRelatedTagsChanged: {
    setRelatedTagsWire
  },
  DocumentLoaded: {
    updateStoreFromUrlWire
  },
  DocumentHistoryChanged: {
    updateStoreFromUrlWire
  }
});
