import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * WireCommit for {@link UrlXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('url');

/**
 * Sets the {@link RelatedTag | related tags }.
 *
 * @public
 */
export const setUrlRelatedTags = wireCommit('setRelatedTags');

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
 * Sets the sort of the url module.
 *
 * @public
 */
export const setUrlSort = wireCommit('setSort');

/**
 * Sets the extra params of the url module.
 *
 * @public
 */
export const setParams = wireCommit('setParams');

/**
 * Sets the scroll of the url module.
 *
 * @public
 */
export const setUrlScroll = wireCommit('setScroll');

/**
 * Sets the initial provided extra params.
 *
 * @public
 */
export const setInitialExtraParams = wireCommit('setInitialExtraParams');

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
    setParams
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
  SortChanged: {
    setUrlSort
  },
  ExtraParamsChanged: {
    setParams
  },
  ExtraParamsInitialized: {
    setInitialExtraParams
  },
  UserScrolledToElement: {
    setUrlScroll
  }
});
