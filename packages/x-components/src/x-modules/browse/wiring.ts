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
export const saveBrowseOriginWire = wireDispatch('saveOrigin', ({ metadata }) => metadata)

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
export const fetchAndSaveBrowseResultsEnrichmentWire = wireDispatch('fetchAndSaveResultsEnrichment')

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
export const setBrowseSelectedFilters = wireCommit('setSelectedFilters')

/**
 * Sets the browse state `sort`.
 *
 * @public
 */
export const setBrowseSort = wireCommit('setSort')

/**
 * Sets the browse state `query`.
 *
 * @public
 */
export const setBrowseUrlParamsWire = wireDispatch('setUrlParams')

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
export const resetBrowseStateForReloadWire = wireCommitWithoutPayload('resetStateForReload')

/**
 * Resets the browse state `isNoResults`.
 *
 * @public
 */
export const resetIsNoBrowseResults = wireCommit('setIsNoResults', false)

/**
 * Resets the browse state `fromNoResultsWithFilters`.
 *
 * @public
 */
export const resetFromNoBrowseResultsWithFilters = wireCommit('setFromNoResultsWithFilters', false)

/**
 * Increases the current browse state `page` by one.
 *
 * @public
 */
export const increaseBrowsePageAppendingResultsWire = wireDispatchWithoutPayload(
  'increasePageAppendingResults',
)

/**
 * Resets the browse state `isAppendingResults`.
 *
 * @public
 */
export const resetBrowseAppending = wireCommit('setIsAppendResults', false)

/**
 * Resets the {@link BrowseGetters.request} parameters when refining request and before the actual
 * request is launched.
 *
 * @public
 */
export const resetBrowseRequestOnRefinementWire = wireDispatch(
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
export const resetBrowseStateIfNoRequestWire = filterTruthyPayload<InternalBrowseRequest | null>(
  wireCommitWithoutPayload('resetState'),
)

/**
 * Browse wiring.
 *
 * @internal
 */
export const browseWiring = createWiring({
  ParamsLoadedFromUrl: {
    setBrowseUrlParamsWire,
    saveBrowseOriginWire,
  },
  UserClickedABrowseSort: {
    setBrowseSort,
  },
  UserReachedResultsListEnd: {
    increaseBrowsePageAppendingResultsWire,
  },
  BrowseRequestUpdated: {
    resetBrowseStateIfNoRequestWire,
    fetchAndSaveBrowseResponseWire,
  },
  BrowseRequestChanged: {
    resetBrowseRequestOnRefinementWire,
  },
  SelectedFiltersForRequestChanged: {
    setBrowseSelectedFilters,
  },
  ResultsChanged: {
    resetBrowseAppending,
    fetchAndSaveBrowseResultsEnrichmentWire,
  },
  ReloadBrowseRequested: {
    resetBrowseStateForReloadWire,
  },
  SelectedSortProvided: {
    setBrowseSort,
  },
  ExtraParamsChanged: {
    setBrowseExtraParams,
  },
  UserClickedCloseX: {
    clearBrowseQuery,
    resetBrowseStateForReloadWire,
    cancelFetchAndSaveBrowseResponseWire,
  },
  UserClickedOpenX: {
    clearBrowseQuery,
    resetBrowseStateForReloadWire,
    cancelFetchAndSaveBrowseResponseWire,
  },
  UserClickedOutOfMainModal: {
    clearBrowseQuery,
  },
  UserSelectedAPage: {
    setBrowsePage,
    resetBrowseAppending,
  },
  UserBrowsedToCategory: {
    setBrowseCategory,
  },
})
