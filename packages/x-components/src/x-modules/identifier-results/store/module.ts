import { setStatus } from '../../../store/utils/helpers/status.helpers';
import { fetchAndSaveIdentifierResults } from './actions/fetch-and-save-identifier-results.action';
import { fetchIdentifierResults } from './actions/fetch-identifier-results.action';
import { saveQuery } from './actions/save-query.action';
import { identifierDetectionRegexp } from './getters/identifier-detection-regexp';
import { identifierHighlightRegexp } from './getters/identifier-highlight-regexp';
import { identifierResultsRequest } from './getters/identifier-results-request';
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
    status: 'success',
    config: {
      debounceInMs: 600,
      maxItemsToRequest: 10,
      identifierDetectionRegexp: '^[0-9]{2,}$',
      separatorChars: '-/ '
    }
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
    setQuery(state, query) {
      state.query = query;
    },
    setStatus
  },
  actions: {
    fetchIdentifierResults,
    fetchAndSaveIdentifierResults,
    saveQuery
  }
};
