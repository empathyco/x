import type { VendorXStoreModule } from './types'
import { setQuery } from '../../../store/utils/query.utils'
import { setUrlParams } from './actions/set-url-params.action'
import { query } from './getters/query.getter'

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
    relatedTags: [],
    results: [],
  }
}

export const vendorXStoreModule: VendorXStoreModule = {
  state: () => ({
    query: '',
    ...resettableVendorState(),
  }),
  getters: {
    query,
  },
  mutations: {
    setQuery,
    setBanners(state, banners) {
      state.banners = banners
    },
    setRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags
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
