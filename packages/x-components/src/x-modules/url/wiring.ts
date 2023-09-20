import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';
import { createRawFilters } from '../../utils/index';

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
 * Sets the url state `query` with a selectedQueryPreview's query.
 *
 * @public
 */
export const setUrlQueryFromPreview = wireCommit(
  'setQuery',
  ({ eventPayload: { query } }) => query
);

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
 * Sets the extra params of the url module from a selectedQueryPreview's extraParams.
 *
 * @public
 */
export const setUrlParamsFromPreview = wireCommit(
  'setParams',
  ({ eventPayload: { extraParams } }) => extraParams
);

/**
 * Sets the filters of the url module from a selectedQueryPreview's filters.
 *
 * @public
 */
export const setUrlSelectedFiltersFromPreview = wireCommit(
  'setFilters',
  ({ eventPayload: { filters } }) => (filters ? createRawFilters(filters) : [])
);

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
  ParamsLoadedFromUrl: {
    setParams
  },
  UserAcceptedAQuery: {
    setUrlQuery
  },
  UserAcceptedAQueryPreview: {
    setUrlQueryFromPreview,
    setUrlParamsFromPreview,
    setUrlSelectedFiltersFromPreview
  },
  UserClearedQuery: {
    setUrlQuery
  },
  SelectedRelatedTagsChanged: {
    setUrlRelatedTags
  },
  SelectedFiltersForRequestChanged: {
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
