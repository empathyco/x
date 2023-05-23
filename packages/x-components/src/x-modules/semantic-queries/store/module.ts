import Vue from 'vue';
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
      threshold: 5
    },
    semanticQueries: [],
    params: {},
    query: ''
  }),
  getters: {
    request
  },
  mutations: {
    clearSemanticQuery(state, query) {
      Vue.delete(state.semanticQueries, query);
    },
    setParams(state, params) {
      state.params = params;
    },
    setSemanticQueries(state, queries) {
      state.semanticQueries = queries;
    },
    setQuery(state, query) {
      state.query = query;
    }
  },
  actions: {
    fetchSemanticQuery,
    fetchAndSaveSemanticQuery
  }
};
