import {
  namespacedWireCommit,
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
 * Requests and stores the search response.
 *
 * @public
 */
export const fetchAndSaveSearchResponseWire = wireDispatchWithoutPayload(
  'fetchAndSaveSearchResponse'
);

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
 * Sets the search state `page`.
 *
 * @public
 */
export const setPage = wireCommit('setPage');

/**
 * Sets the search state `page`.
 *
 * @public
 */
export const setParams = wireCommit('setParams');

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
 * Search wiring.
 *
 * @internal
 */
export const searchWiring = createWiring({
  UserAcceptedAQuery: {
    resetPage,
    setSearchQuery,
    resetSort
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
    setRelatedTags
  },
  SelectedFiltersChanged: {
    resetPage,
    setSelectedFilters
  },
  // TODO: remove when facets refactor is done
  SelectedFiltersNextChanged: {
    resetPage,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setSelectedFilters
  },
  UserClickedASort: {
    resetPage,
    setSort
  },
  SelectedSortProvided: {
    resetPage,
    setSort
  },
  UserReachedResultsListEnd: {
    increasePageAppendingResults
  },
  ExtraParamsChanged: {
    setParams,
    resetPage,
    resetSort,
    resetFacets
  }
});
