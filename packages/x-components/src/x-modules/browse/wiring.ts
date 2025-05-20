import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload,
} from '../../wiring/namespaced-wires.factory'
import { createWiring } from '../../wiring/wiring.utils'

const moduleName = 'browse'

const wireCommit = namespacedWireCommit(moduleName)

const resetStateWire = wireCommit('resetState')
const resetPageWire = wireCommit('setPage', 1)
const setBrowseWire = wireCommit('setBrowse')
const setSelectedFilters = wireCommit('setSelectedFilters')
const setSortWire = wireCommit('setSort')
const setPageWire = wireCommit('setPage')
const setPageSizeWire = wireCommit('setPageSize')
const setSearchExtraParams = wireCommit('setParams')

const wireDispatch = namespacedWireDispatch(moduleName)

const navigateWire = wireDispatch('browseAndSave')
const increasePageWire = wireDispatch('increasePage')
const setUrlParamsWire = wireDispatch('setUrlParams')

const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName)

const cancelBrowseWire = wireDispatchWithoutPayload('cancelBrowse')

export const browseWiring = createWiring({
  ExtraParamsChanged: {
    setSearchExtraParams,
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
    setSelectedFilters,
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
    setUrlParamsWire,
  },
})
