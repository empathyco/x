import type { VendorXStoreModule } from '../types'

export const setUrlParams: VendorXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query },
) => {
  commit('setQuery', query)
}
