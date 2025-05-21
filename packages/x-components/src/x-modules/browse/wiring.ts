import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload,
} from '../../wiring/namespaced-wires.factory'
import { createWiring } from '../../wiring/wiring.utils'

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
 * Resets the browse state to its initial value.
 *
 * @public
 */
export const resetStateWire = wireCommit('resetState')

/**
 * Resets the browse state `page` to its initial value, 1.
 *
 * @public
 */
export const resetPageWire = wireCommit('setPage', 1)

/**
 * Sets the browse state `selectedCategory`.
 *
 * @public
 */
export const setBrowseWire = wireCommit('setBrowse')

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
export const setSortWire = wireCommit('setSort')

/**
 * Sets the browse state `page`.
 *
 * @public
 */
export const setPageWire = wireCommit('setPage')

/**
 * Sets the browse state `config.pageSize`.
 *
 * @public
 */
export const setPageSizeWire = wireCommit('setPageSize')

/**
 * Sets the browse state `params`.
 *
 * @public
 */
export const setBrowseExtraParams = wireCommit('setParams')

/**
 * WireDispatch for {@link BrowseXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName)

/**
 * Requests and stores the browse response.
 *
 * @public
 */
export const navigateWire = wireDispatch('browseAndSave')

/**
 * Increases the current browse state `page` by one.
 *
 * @public
 */
export const increasePageWire = wireDispatch('increasePage')

/**
 * Sets the browse URL params.
 *
 * @public
 */
export const setBrowseUrlParamsWire = wireDispatch('setUrlParams')

/**
 * WireCommit without Payload for {@link BrowseXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName)

/**
 * Cancels the {@link BrowseActions.browse} request promise.
 *
 * @public
 */
export const cancelBrowseWire = wireDispatchWithoutPayload('cancelBrowse')

/**
 * Browse wiring.
 *
 * @internal
 */
export const browseWiring = createWiring({
  ExtraParamsChanged: {
    setBrowseExtraParams,
  },
  BrowseRequestChanged: {
    navigateWire,
  },
  UserBrowsedToCategory: {
    resetStateWire,
    setBrowseWire,
  },
  UserReachedResultsListEnd: {
    increasePageWire,
  },
  SelectedFiltersChanged: {
    setBrowseSelectedFilters,
    resetPageWire,
  },
  UserClickedABrowseSort: {
    setSortWire,
    resetPageWire,
  },
  SelectedBrowseSortProvided: {
    setSortWire,
    resetPageWire,
  },
  UserClickedOpenX: {
    resetStateWire,
    cancelBrowseWire,
  },
  UserSelectedABrowsePage: {
    setPageWire,
  },
  UserSelectedAPageSize: {
    setPageSizeWire,
  },
  ParamsLoadedFromUrl: {
    setBrowseUrlParamsWire,
  },
})
