import { SemanticQueriesXStoreModule } from './types';
import { fetchSemanticQuery } from './actions/fetch-semantic-query.action';
import { fetchAndSaveSemanticQuery } from './actions/fetch-and-save-semantic-query.action';
import { request } from './getters/request.getter';

/**
 * {@link XStoreModule} For the `semantic-queries` module.
 *
 * @internal
 */
export const semanticQueriesXStoreModule: SemanticQueriesXStoreModule = {
  state: () => ({
    config: {
      threshold: 5,
      maxItemsToRequest: 3
    },
    semanticQueries: [],
    params: {},
    query: '',
    totalResults: 0
  }),
  getters: {
    request
  },
  mutations: {
    setParams(state, params) {
      state.params = params;
    },
    setSemanticQueries(state, queries) {
      state.semanticQueries = queries;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setTotalResults(state, totalResults) {
      state.totalResults = totalResults;
    }
  },
  actions: {
    fetchSemanticQuery,
    fetchAndSaveSemanticQuery
  }
};
