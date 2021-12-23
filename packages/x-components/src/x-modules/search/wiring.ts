import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { WirePayload } from '../../wiring/wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { InternalSearchRequest } from './types';

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
 * Batches state resets after {@link SearchGetters.request} parameters update.
 *
 * @public
 */
export const batchStateResetsAfterRequestUpdateWire = wireDispatch(
  'batchStateResetsAfterRequestUpdate',
  ({ metadata: { oldValue }, eventPayload }: WirePayload<InternalSearchRequest>) => ({
    newRequest: eventPayload,
    oldRequest: oldValue!
  })
);

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
export const saveOriginWire = wireDispatch('saveOrigin', ({ metadata }) => metadata);

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
export const setUrlParams = wireDispatch('setUrlParams');

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
    setSearchQuery,
    saveOriginWire
  },
  UserAcceptedSpellcheckQuery: {
    resetSpellcheckQuery
  },
  UserClearedQuery: {
    setSearchQuery,
    cancelFetchAndSaveSearchResponseWire
  },
  UserClickedASort: {
    setSort
  },
  UserPickedARelatedTag: {
    saveOriginWire
  },
  UserReachedResultsListEnd: {
    increasePageAppendingResults
  },
  SearchRequestChanged: {
    fetchAndSaveSearchResponseWire
  },
  SearchRequestUpdated: {
    batchStateResetsAfterRequestUpdateWire
  },
  SelectedRelatedTagsChanged: {
    setRelatedTags
  },
  SelectedFiltersChanged: {
    setSelectedFilters
  },
  ResultsChanged: {
    resetAppending
  },
  SelectedSortProvided: {
    setSort
  },
  ExtraParamsChanged: {
    setSearchExtraParams
  },
  ParamsLoadedFromUrl: {
    setUrlParams,
    saveOriginWire
  }
});
