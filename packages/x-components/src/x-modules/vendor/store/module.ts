import type { VendorResult, VendorResultTagging, VendorXStoreModule } from './types'

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
  actions: {
    track(
      _context,
      payload: { result: VendorResult; trackingProperty: keyof VendorResultTagging }
    ) {
      const url = payload.result.tagging?.[payload.trackingProperty]
      if (url) {
        void fetch(url)
      }
    },
  },
}
