import type { VendorXStoreModule } from './types'
import { setStatus } from '../../../store'

export const vendorXStoreModule: VendorXStoreModule = {
  state: () => ({
    status: 'initial',
    vendorResults: [],
  }),
  getters: {},
  mutations: {
    setStatus,
    setVendorResults(state, vendorResults) {
      state.vendorResults = vendorResults
    },
  },
  actions: {},
}
