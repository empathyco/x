import type { SearchBoxXStoreModule } from './types'
import { setQuery } from '../../../store/utils/query.utils'
import { setInputStatus } from './actions/set-input-status.action'
import { setUrlParams } from './actions/set-url-params.action'

/**
 * {@link XStoreModule} For the search-box module.
 *
 * @internal
 */
export const searchBoxXStoreModule: SearchBoxXStoreModule = {
  state: () => ({
    query: '',
    inputStatus: 'initial',
  }),
  getters: {
    trimmedQuery(state) {
      return state.query.trim()
    },
  },
  mutations: {
    setQuery,
    setInputStatus(state, status) {
      state.inputStatus = status
    },
  },
  actions: {
    setUrlParams,
    setInputStatus,
  },
}
