import Vue from 'vue';
import { SemanticQueriesXStoreModule } from './types';
import { fetchSemanticQuery } from './actions/fetch-semantic-query.action';
import { fetchAndSaveSemanticQuery } from './actions/fetch-and-save-semantic-query.action';

/**
 * {@link XStoreModule} For the `semantic-queries` module.
 *
 * @internal
 */
export const semanticQueriesXStoreModule: SemanticQueriesXStoreModule = {
  state: () => ({
    config: {
      maxItemsToRequest: 24
    },
    semanticQueries: {},
    params: {}
  }),
  getters: {},
  mutations: {
    clearSemanticQuery(state, query) {
      Vue.delete(state.semanticQueries, query);
    },
    setParams(state, params) {
      state.params = params;
    },
    setSemanticQuery(state, semanticQuery) {
      Vue.set(state.semanticQueries, semanticQuery.request.query, semanticQuery);
    },
    setStatus(state, { query, status }) {
      state.semanticQueries[query].status = status;
    }
  },
  actions: {
    fetchSemanticQuery,
    fetchAndSaveSemanticQuery
  }
};
