import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `search` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'search';
/**
 * WireCommit for {@link SearchXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * WireDispatch for {@link SearchXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * WireDispatchWithoutPayload for {@link SearchXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Cancels the {@link SearchActions.fetchAndSaveSearchResponse} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveSearchResponseWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveSearchResponse'
);

/**
 * Sets the search state `origin`.
 *
 * @public
 */
export const setOrigin = wireCommit('setOrigin', ({ metadata }) => metadata.origin);

/**
 * Requests and stores the search response.
 *
 * @public
 */
export const fetchAndSaveSearchResponseWire = wireDispatch('fetchAndSaveSearchResponse');

/**
 * Resets the search state `spellcheckedQuery` to its initial value, an empty string.
 *
 * @public
 */
export const resetSpellcheckQuery = wireCommit('setSpellcheck', '');

/**
 * Sets the search state `relatedTags`.
 *
 * @public
 */
export const setRelatedTags = wireCommit('setRelatedTags');

/**
 * Sets the search state `query`.
 *
 * @public
 */
export const setSearchQuery = wireCommit('setQuery');

/**
 * Sets the search state `selectedFilters`.
 *
 * @public
 */
export const setSelectedFilters = wireCommit('setSelectedFilters');

/**
 * Sets the search state `sort`.
 *
 * @public
 */
export const setSort = wireCommit('setSort');

/**
 * Sets the search state `query`.
 *
 * @public
 */
export const setParamsFromUrl = wireDispatch('setParamsFromUrl');

/**
 * Sets the search state `page`.
 *
 * @public
 */
export const setSearchPage = wireCommit('setPage');

/**
 * Sets the search state `params`.
 *
 * @public
 */
export const setSearchExtraParams = wireCommit('setParams');

/**
 * Increases the current search state `page` by one.
 *
 * @public
 */
export const increasePageAppendingResults = wireDispatchWithoutPayload(
  'increasePageAppendingResults'
);

/**
 * Sets the search state `pageSize`.
 *
 * @public
 */
export const setPageSize = wireCommit('setPageSize');

/**
 * Sets 1 to the search state `page`.
 *
 * @public
 */
export const resetPage = wireCommit('setPage', 1);

/**
 * Sets empty value to the search state `sort`.
 *
 * @public
 */
export const resetSort = wireCommit('setSort', '');

/**
 * Sets empty value to the search state `facets`.
 *
 * @public
 */
export const resetFacets = wireCommit('setFacets', []);

/**
 * Resets the search state `isAppendingResults`.
 *
 * @public
 */
export const resetAppending = wireCommit('setIsAppendResults', false);

/**
 * Search wiring.
 *
 * @internal
 */
export const searchWiring = createWiring({
  UserAcceptedAQuery: {
    resetPage,
    resetSort,
    setSearchQuery,
    setOrigin
  },
  UserAcceptedSpellcheckQuery: {
    resetPage,
    resetSpellcheckQuery
  },
  UserClearedQuery: {
    resetPage,
    setSearchQuery,
    cancelFetchAndSaveSearchResponseWire
  },
  SearchRequestChanged: {
    fetchAndSaveSearchResponseWire
  },
  SelectedRelatedTagsChanged: {
    resetPage,
    resetAppending,
    setRelatedTags,
    setOrigin
  },
  SelectedFiltersChanged: {
    resetPage,
    resetAppending,
    setSelectedFilters
  },
  UserClickedASort: {
    resetPage,
    resetAppending,
    setSort
  },
  SelectedSortProvided: {
    setSort
  },
  UserReachedResultsListEnd: {
    increasePageAppendingResults
  },
  ExtraParamsChanged: {
    resetPage,
    resetSort,
    resetFacets,
    setSearchExtraParams
  },
  ParamsLoadedFromUrl: {
    setParamsFromUrl
  }
});
