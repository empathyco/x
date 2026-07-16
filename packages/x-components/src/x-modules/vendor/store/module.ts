import type { VendorXStoreModule } from './types'

export const vendorXStoreModule: VendorXStoreModule = {
  state: () => ({
    banners: [],
    results: [],
  }),
  getters: {},
  mutations: {
    setBanners(state, banners) {
      state.banners = banners
    },
    setResults(state, results) {
      state.results = results
    },
  },
  actions: {},
}
