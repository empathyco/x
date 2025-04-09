import type { SemanticQueriesXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { setQuery } from '../../../store/utils/query.utils'
import { fetchAndSaveSemanticQuery } from './actions/fetch-and-save-semantic-query.action'
import { fetchSemanticQuery } from './actions/fetch-semantic-query.action'
import { normalizedQuery } from './getters/normalized-query.getter'
import { request } from './getters/request.getter'

/**
 * {@link XStoreModule} For the `semantic-queries` module.
 *
 * @internal
 */
export const semanticQueriesXStoreModule: SemanticQueriesXStoreModule = {
  state: () => ({
    config: {
      threshold: 5,
      maxItemsToRequest: 3,
    },
    semanticQueries: [],
    params: {},
    query: '',
    totalResults: 0,
  }),
  getters: {
    request,
    normalizedQuery,
  },
  mutations: {
    setParams(state, params) {
      state.params = params
    },
    setSemanticQueries(state, queries) {
      state.semanticQueries = queries
    },
    setQuery,
    setTotalResults(state, totalResults) {
      state.totalResults = totalResults
    },
    setConfig,
    mergeConfig,
  },
  actions: {
    fetchSemanticQuery,
    fetchAndSaveSemanticQuery,
  },
}
