import type { WirePayload } from '../../wiring'
import type { InternalBrowseRequest } from './types'
import {
  createWiring,
  filterTruthyPayload,
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload,
} from '../../wiring'

/**
 * `browse` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'browse'

/**
 * WireCommit for {@link BrowseXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName)

/**
 * WireCommit without Payload for {@link BrowseXModule}.
 *
 * @internal
 */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload(moduleName)

/**
 * WireDispatch for {@link BrowseXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName)

/**
 * WireDispatchWithoutPayload for {@link BrowseXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName)

/**
 * Cancels the {@link BrowseActions.fetchAndSaveBrowseResponse} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveBrowseResponseWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveBrowseResponse',
)

/**
 * Sets the browse state `origin`.
 *
 * @public
 */
export const saveOriginWire = wireDispatch('saveOrigin', ({ metadata }) => metadata)

/**
 * Requests and stores the browse response.
 *
 * @public
 */
export const fetchAndSaveBrowseResponseWire = wireDispatch('fetchAndSaveBrowseResponse')

/**
 * Requests and stores the enrichment results for the results.
 *
 * @public
 */
export const fetchAndSaveResultsEnrichmentWire = wireDispatch('fetchAndSaveResultsEnrichment')

/**
 * Sets the browse state `selectedCategory`.
 *
 * @public
 */
export const setBrowseCategory = wireCommit('setSelectedCategory')

/**
 * Clears the browse state `selectedCategory`.
 *
 * @public
 */
export const clearBrowseQuery = wireCommit('setSelectedCategory', {
  browseField: '',
  browseValue: '',
})

/**
 * Sets the browse state `selectedFilters`.
 *
 * @public
 */
export const setSelectedFilters = wireCommit('setSelectedFilters')

/**
 * Sets the browse state `sort`.
 *
 * @public
 */
export const setSort = wireCommit('setSort')

/**
 * Sets the browse state `query`.
 *
 * @public
 */
export const setUrlParams = wireDispatch('setUrlParams')

/**
 * Sets the browse state `page`.
 *
 * @public
 */
export const setBrowsePage = wireCommit('setPage')

/**
 * Sets the browse state `params`.
 *
 * @public
 */
export const setBrowseExtraParams = wireCommit('setParams')

/**
 * Resets the browse state to reload the current browse.
 *
 * @public
 */
export const resetStateForReloadWire = wireCommitWithoutPayload('resetStateForReload')

/**
 * Resets the browse state `isNoResults`.
 *
 * @public
 */
export const resetIsNoResults = wireCommit('setIsNoResults', false)

/**
 * Resets the browse state `fromNoResultsWithFilters`.
 *
 * @public
 */
export const resetFromNoResultsWithFilters = wireCommit('setFromNoResultsWithFilters', false)

/**
 * Increases the current browse state `page` by one.
 *
 * @public
 */
export const increasePageAppendingResultsWire = wireDispatchWithoutPayload(
  'increasePageAppendingResults',
)

/**
 * Resets the browse state `isAppendingResults`.
 *
 * @public
 */
export const resetAppending = wireCommit('setIsAppendResults', false)

/**
 * Resets the {@link BrowseGetters.request} parameters when refining request and before the actual
 * request is launched.
 *
 * @public
 */
export const resetRequestOnRefinementWire = wireDispatch(
  'resetRequestOnRefinement',
  ({ eventPayload: newRequest, metadata: { oldValue } }: WirePayload<InternalBrowseRequest>) => ({
    newRequest,
    oldRequest: oldValue as InternalBrowseRequest,
  }),
)

/**
 * Resets the browse state when the request is changed to null. See the
 * {@link BrowseXStoreModule} for details.
 *
 * @public
 */
export const resetStateIfNoRequestWire = filterTruthyPayload<InternalBrowseRequest | null>(
  wireCommitWithoutPayload('resetState'),
)

/**
 * Browse wiring.
 *
 * @internal
 */
export const browseWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams,
    saveOriginWire,
  },
  UserClickedABrowseSort: {
    setSort,
  },
  UserReachedResultsListEnd: {
    increasePageAppendingResultsWire,
  },
  BrowseRequestUpdated: {
    resetStateIfNoRequestWire,
    fetchAndSaveBrowseResponseWire,
  },
  BrowseRequestChanged: {
    resetRequestOnRefinementWire,
  },
  SelectedFiltersForRequestChanged: {
    setSelectedFilters,
  },
  ResultsChanged: {
    resetAppending,
    fetchAndSaveResultsEnrichmentWire,
  },
  ReloadBrowseRequested: {
    resetStateForReloadWire,
  },
  SelectedSortProvided: {
    setSort,
  },
  ExtraParamsChanged: {
    setBrowseExtraParams,
  },
  UserClickedCloseX: {
    clearBrowseQuery,
    resetStateForReloadWire,
    cancelFetchAndSaveBrowseResponseWire,
  },
  UserClickedOpenX: {
    clearBrowseQuery,
    resetStateForReloadWire,
    cancelFetchAndSaveBrowseResponseWire,
  },
  UserClickedOutOfMainModal: {
    clearBrowseQuery,
  },
  UserSelectedAPage: {
    setBrowsePage,
    resetAppending,
  },
  UserBrowsedToCategory: {
    setBrowseCategory,
  },
})
