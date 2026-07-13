import type { VendorXStoreModule } from './types'

export const vendorXStoreModule: VendorXStoreModule = {
  state: () => ({
    results: [],
  }),
  getters: {},
  mutations: {
    setResults(state, results) {
      state.results = results
    },
  },
  actions: {},
}
