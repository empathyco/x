import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import { setQuery } from '../../../store/utils/query.utils';
import { SemanticQueriesXStoreModule } from './types';
import { fetchSemanticQuery } from './actions/fetch-semantic-query.action';
import { fetchAndSaveSemanticQuery } from './actions/fetch-and-save-semantic-query.action';
import { request } from './getters/request.getter';
import { normalizedQuery } from './getters/normalized-query.getter';
import { query } from './getters/semanti-queries-query.getter';

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
    totalResults: 0,
    relatedTags: []
  }),
  getters: {
    request,
    normalizedQuery,
    query
  },
  mutations: {
    setParams(state, params) {
      state.params = params;
    },
    setSemanticQueries(state, queries) {
      state.semanticQueries = queries;
    },
    setQuery,
    setTotalResults(state, totalResults) {
      state.totalResults = totalResults;
    },
    setSemanticQueriesRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags;
    },
    setConfig,
    mergeConfig
  },
  actions: {
    fetchSemanticQuery,
    fetchAndSaveSemanticQuery
  }
};
