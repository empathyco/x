import { namespacedWireDispatch } from '../../wiring';
import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
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
 * Sets the {@link RelatedTag | related tags }.
 *
 * @public
 */
export const setUrlRelatedTags = wireCommit('setRelatedTags');

/**
 * Updates the store state from the URL.
 *
 * @public
 */
export const updateStoreFromUrl = wireDispatch('updateStoreFromUrl');

/**
 * Sets the query of the url module.
 *
 * @public
 */
export const setUrlQuery = wireCommit('setQuery');

/**
 * Sets the page of the url module.
 *
 * @public
 */
export const setUrlPage = wireCommit('setPage');
/**
 * Sets the extra params of the url module.
 *
 * @public
 */
export const setUrlExtraParams = wireCommit('setExtraParams');

/**
 * Sets the filters of the url module.
 *
 * @public
 */
export const setUrlFilters = wireCommit('setFilters');

/**
 * Wiring configuration for the {@link UrlXModule | url module}.
 *
 * @internal
 */
export const urlWiring = createWiring({
  UserAcceptedAQuery: {
    setUrlQuery
  },
  UserClearedQuery: {
    setUrlQuery
  },
  ParamsLoadedFromUrl: {
    updateStoreFromUrl
  },
  SelectedRelatedTagsChanged: {
    setUrlRelatedTags
  },
  SelectedFiltersChanged: {
    setUrlFilters
  },
  PageChanged: {
    setUrlPage
  },
  ExtraParamsProvided: {
    setUrlExtraParams
  },
  UserChangedExtraParams: {
    setUrlExtraParams
  }
});
