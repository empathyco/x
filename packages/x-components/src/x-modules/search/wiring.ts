import type { WirePayload } from '../../wiring'
import type { InternalSearchRequest } from './types'
import { createRawFilters } from '../../utils'
import {
  createWiring,
  filterTruthyPayload,
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload,
} from '../../wiring'

/**
 * `search` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'search'

/**
 * WireCommit for {@link SearchXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName)

/**
 * WireCommit without Payload for {@link SearchXModule}.
 *
 * @internal
 */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload(moduleName)

/**
 * WireDispatch for {@link SearchXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName)

/**
 * WireDispatchWithoutPayload for {@link SearchXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName)

/**
 * Cancels the {@link SearchActions.fetchAndSaveSearchResponse} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveSearchResponseWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveSearchResponse',
)

/**
 * Sets the search state `origin`.
 *
 * @public
 */
export const saveOriginWire = wireDispatch('saveOrigin', ({ metadata }) => metadata)

/**
 * Requests and stores the search response.
 *
 * @public
 */
export const fetchAndSaveSearchResponseWire = wireDispatch('fetchAndSaveSearchResponse')

/**
 * Resets the search state `spellcheckedQuery` to its initial value, an empty string.
 *
 * @public
 */
export const resetSpellcheckQuery = wireCommit('setSpellcheck', '')

/**
 * Sets the search state `relatedTags`.
 *
 * @public
 */
export const setRelatedTags = wireCommit('setRelatedTags')

/**
 * Sets the search state `query`.
 *
 * @public
 */
export const setSearchQuery = wireCommit('setQuery')

/**
 * Clears the search state `query`.
 *
 * @public
 */
export const clearSearchQuery = wireCommit('setQuery', '')

/**
 * Sets the search state `selectedFilters`.
 *
 * @public
 */
export const setSelectedFilters = wireCommit('setSelectedFilters')

/**
 * Sets the search state `sort`.
 *
 * @public
 */
export const setSort = wireCommit('setSort')

/**
 * Sets the search state `query`.
 *
 * @public
 */
export const setUrlParams = wireDispatch('setUrlParams')

/**
 * Sets the search state `page`.
 *
 * @public
 */
export const setSearchPage = wireCommit('setPage')

/**
 * Sets the search state `params`.
 *
 * @public
 */
export const setSearchExtraParams = wireCommit('setParams')

/**
 * Resets the search state to reload the current search.
 *
 * @public
 */
export const resetStateForReloadWire = wireCommitWithoutPayload('resetStateForReload')

/**
 * Resets the search state `isNoResults`.
 *
 * @public
 */
export const resetIsNoResults = wireCommit('setIsNoResults', false)

/**
 * Resets the search state `fromNoResultsWithFilters`.
 *
 * @public
 */
export const resetFromNoResultsWithFilters = wireCommit('setFromNoResultsWithFilters', false)

/**
 * Increases the current search state `page` by one.
 *
 * @public
 */
export const increasePageAppendingResultsWire = wireDispatchWithoutPayload(
  'increasePageAppendingResults',
)

/**
 * Resets the search state `isAppendingResults`.
 *
 * @public
 */
export const resetAppending = wireCommit('setIsAppendResults', false)

/**
 * Resets the {@link SearchGetters.request} parameters when refining request and before the actual
 * request is launched.
 *
 * @public
 */
export const resetRequestOnRefinementWire = wireDispatch(
  'resetRequestOnRefinement',
  ({ eventPayload: newRequest, metadata: { oldValue } }: WirePayload<InternalSearchRequest>) => ({
    newRequest,
    oldRequest: oldValue as InternalSearchRequest,
  }),
)

/**
 * Resets the search state when the request is changed to null. See the
 * {@link SearchXStoreModule} for details.
 *
 * @public
 */
export const resetStateIfNoRequestWire = filterTruthyPayload<InternalSearchRequest | null>(
  wireCommitWithoutPayload('resetState'),
)

/**
 * Sets the search state `query` with the selectedQueryPreview's query.
 *
 * @public
 */
export const setSearchQueryFromPreview = wireCommit(
  'setQuery',
  ({ eventPayload: { query } }) => query,
)

/**
 * Sets the search state `params` with the selectedQueryPreview's extraParams.
 *
 * @public
 */
export const setSearchExtraParamsFromPreview = wireCommit(
  'setParams',
  ({ eventPayload: { extraParams } }) => extraParams,
)

/**
 * Sets the search state `selectedFilters` with the selectedQueryPreview's filters.
 *
 * @public
 */
export const setSearchSelectedFiltersFromPreview = wireCommit(
  'setSelectedFilters',
  ({ eventPayload: { filters } }) => (filters ? createRawFilters(filters) : []),
)

/**
 * Sets the search state `selectedFilters` with a selectedHistoryQuery's filters.
 *
 * @public
 */
export const setSearchSelectedFiltersFromHistoryQuery = wireCommit(
  'setSelectedFilters',
  ({ eventPayload: { selectedFilters } }) => selectedFilters ?? [],
)

/**
 * Search wiring.
 *
 * @internal
 */
export const searchWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams,
    saveOriginWire,
  },
  UserAcceptedAQuery: {
    setSearchQuery,
    saveOriginWire,
  },
  EmpathizeHasNoContent: {
    setSearchQuery,
    saveOriginWire,
  },
  UserAcceptedSpellcheckQuery: {
    resetSpellcheckQuery,
  },
  UserClearedQuery: {
    setSearchQuery,
    cancelFetchAndSaveSearchResponseWire,
    resetFromNoResultsWithFilters,
    resetIsNoResults,
  },
  UserClickedASort: {
    setSort,
  },
  UserPickedARelatedTag: {
    saveOriginWire,
  },
  UserReachedResultsListEnd: {
    increasePageAppendingResultsWire,
  },
  SearchRequestUpdated: {
    resetStateIfNoRequestWire,
    fetchAndSaveSearchResponseWire,
  },
  SearchRequestChanged: {
    resetRequestOnRefinementWire,
  },
  SelectedRelatedTagsChanged: {
    setRelatedTags,
  },
  SelectedFiltersForRequestChanged: {
    setSelectedFilters,
  },
  ResultsChanged: {
    resetAppending,
  },
  ReloadSearchRequested: {
    resetStateForReloadWire,
  },
  SelectedSortProvided: {
    setSort,
  },
  ExtraParamsChanged: {
    setSearchExtraParams,
  },
  UserClickedCloseX: {
    clearSearchQuery,
  },
  UserClickedOutOfMainModal: {
    clearSearchQuery,
  },
  UserAcceptedAQueryPreview: {
    setSearchQueryFromPreview,
    setSearchExtraParamsFromPreview,
    setSearchSelectedFiltersFromPreview,
    saveOriginWire,
  },
  QueryPreviewUnselected: {
    setSearchExtraParams,
  },
  UserSelectedAHistoryQuery: {
    setSearchSelectedFiltersFromHistoryQuery,
  },
  UserSelectedAPage: {
    setSearchPage,
    resetAppending,
  },
})
