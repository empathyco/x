import type { VendorXStoreModule } from './types'
import { setQuery } from '../../../store/utils/query.utils'
import { setUrlParams } from './actions/set-url-params.action'

/**
 * Function to return the "resettable" part of the state.
 *
 * @returns The "resettable" part of the {@link VendorState}.
 *
 * @internal
 */
export function resettableVendorState() {
  return {
    banners: [],
    results: [],
  }
}

export const vendorXStoreModule: VendorXStoreModule = {
  state: () => ({
    query: '',
    ...resettableVendorState(),
  }),
  getters: {
    query: state => state.query,
  },
  mutations: {
    setQuery,
    setBanners(state, banners) {
      state.banners = banners
    },
    setResults(state, results) {
      state.results = results
    },
    resetState(state) {
      Object.assign(state, resettableVendorState())
    },
  },
  actions: {
    setUrlParams,
  },
}
