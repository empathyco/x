import { fetchAndSaveIdentifierResults } from './actions/fetch-and-save-identifier-results.action';
import { fetchIdentifierResults } from './actions/fetch-identifier-results.action';
import { saveQuery } from './actions/save-query.action';
import { regex } from './getters/regex';
import { request } from './getters/request';
import { IdentifierResultsXStoreModule } from './types';
/**
 * {@link XStoreModule} For the identifier results module.
 *
 * @internal
 */
export const identifierResultsXStoreModule: IdentifierResultsXStoreModule = {
  state: () => ({
    query: '',
    identifierResults: [],
    config: {
      debounceInMs: 600,
      maxItemsToRequest: 10,
      regex: '^[0-9]{2,}$'
    }
  }),
  getters: {
    request,
    regex
  },
  mutations: {
    setIdentifierResults(state, identifierResults) {
      state.identifierResults = identifierResults;
    },
    setQuery(state, query) {
      state.query = query;
    }
  },
  actions: {
    fetchIdentifierResults,
    fetchAndSaveIdentifierResults,
    saveQuery
  }
};
