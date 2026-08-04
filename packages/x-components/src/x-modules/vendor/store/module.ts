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
    queryPreviews: {},
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
    setQueryPreviewVendorResults(state, { queryPreviewHash, results }) {
      state.queryPreviews[queryPreviewHash] = {
        ...state.queryPreviews[queryPreviewHash],
        results: results.map(vendorResult => ({
          ...vendorResult,
          modelName: 'VendorResult' as const,
        })),
      }
    },
    setQueryPreviewVendorBanners(state, { queryPreviewHash, banners }) {
      state.queryPreviews[queryPreviewHash] = {
        ...state.queryPreviews[queryPreviewHash],
        banners: banners.map(vendorBanner => ({
          ...vendorBanner,
          modelName: 'VendorBanner' as const,
        })),
      }
    },
    removeQueryPreviewVendorData(state, queryPreviewHash) {
      delete state.queryPreviews[queryPreviewHash]
    },
    resetState(state) {
      Object.assign(state, resettableVendorState())
    },
  },
  actions: {
    setUrlParams,
  },
}
