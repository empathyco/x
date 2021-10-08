import { Filter, RelatedTag } from '@empathyco/x-types';
import { mapWire, namespacedWireDispatch } from '../../wiring';
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
const wireDispatch = namespacedWireDispatch('url');

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
 * Enables loading params from the url.
 *
 * @public
 */
export const enableLoadFromUrl = wireCommit('setLoadedFromUrl', true);

/**
 * Disables loading params from the url.
 *
 * @public
 */
export const disableLoadFromUrl = wireCommit('setLoadedFromUrl', false);

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
export const updateState = wireDispatch('updateStoreFromUrl');

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
 * Sets the scroll of the url module.
 *
 * @public
 */
export const setScroll = wireCommit('setScroll');

/**
 * Sets the filters of the url module.
 *
 * @public
 */
export const setFiltersWire = mapWire(wireCommit('setFilters'), (filters: Filter[]) =>
  filters.map(filter => filter.id)
);

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
    updateState,
    enableLoadFromUrl
  },
  UrlChanged: {
    disableLoadFromUrl
  },
  SelectedRelatedTagsChanged: {
    setRelatedTagsWire
  },
  SelectedFiltersChanged: {
    setFiltersWire
  },
  PageChanged: {
    setPage
  },
  FirstItemInScrollViewChanged: {
    setScroll
  }
});
