import { setStatus } from '../../../store/utils/status-store.utils';
import {
  cancelFetchAndSaveIdentifierResults,
  fetchAndSaveIdentifierResults
} from './actions/fetch-and-save-identifier-results.action';
import { fetchIdentifierResults } from './actions/fetch-identifier-results.action';
import { saveOrigin } from './actions/save-origin.action';
import { saveQuery } from './actions/save-query.action';
import { identifierDetectionRegexp } from './getters/identifier-detection-regexp.getter';
import { identifierHighlightRegexp } from './getters/identifier-highlight-regexp.getter';
import { identifierResultsRequest } from './getters/identifier-results-request.getter';
import { IdentifierResultsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the identifier results module.
 *
 * @internal
 */
export const identifierResultsXStoreModule: IdentifierResultsXStoreModule = {
  state: () => ({
    config: {
      debounceInMs: 600,
      maxItemsToRequest: 10,
      identifierDetectionRegexp: '^[0-9]{2,}$',
      separatorChars: '-/ '
    },
    identifierResults: [],
    origin: null,
    query: '',
    params: {},
    status: 'initial'
  }),
  getters: {
    identifierResultsRequest,
    identifierHighlightRegexp,
    identifierDetectionRegexp
  },
  mutations: {
    setIdentifierResults(state, identifierResults) {
      state.identifierResults = identifierResults;
    },
    setOrigin(state, origin = null) {
      state.origin = origin;
    },
    setParams(state, params) {
      state.params = params;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setStatus
  },
  actions: {
    cancelFetchAndSaveIdentifierResults,
    fetchIdentifierResults,
    fetchAndSaveIdentifierResults,
    saveOrigin,
    saveQuery
  }
};
