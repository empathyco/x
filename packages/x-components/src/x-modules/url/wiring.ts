import { Filter, RelatedTag } from '@empathyco/x-types';
import { mapWire, namespacedWireCommitWithoutPayload } from '../../wiring';
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
 * WireCommit for {@link UrlXModule}.
 *
 * @internal
 */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload('url');

/**
 * WireDispatch without payload for {@link UrlXModule}.
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
 * Sets the {@link RelatedTag | related tags }.
 *
 * @public
 */
export const setRelatedTagsWire = mapWire(
  wireCommit('setRelatedTags'),
  (relatedTags: RelatedTag[]) => relatedTags.map(relatedTag => relatedTag.tag)
);

/**
 * Sets the {@link Filter | filter }.
 *
 * @public
 */
export const setFiltersWire = mapWire(wireCommit('setFilters'), (filters: Filter[]) =>
  filters.map(f => f.id)
);

/**
 * Resets the {@link Filters | related tags }.
 *
 * @public
 */
export const resetFilterWire = wireCommitWithoutPayload('resetFilters');

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
 * Sets the page of the url module.
 *
 * @public
 */
export const setPage = wireCommit('setPage');

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
    setQuery,
    resetFilterWire
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
  },
  SelectedFiltersChanged: {
    setFiltersWire
  },
  PageChanged: {
    setPage
  }
});
