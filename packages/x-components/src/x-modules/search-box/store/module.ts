import { setQuery } from '../../../store/utils/query.utils';
import { setUrlParams } from './actions/set-url-params.action';
import { SearchBoxXStoreModule } from './types';
import { setInputStatus } from './actions/set-input-status.action';

/**
 * {@link XStoreModule} For the search-box module.
 *
 * @internal
 */
export const searchBoxXStoreModule: SearchBoxXStoreModule = {
  state: () => ({
    query: '',
    inputStatus: 'initial'
  }),
  getters: {
    trimmedQuery(state) {
      return state.query.trim();
    }
  },
  mutations: {
    setQuery,
    setInputStatus(state, status) {
      state.inputStatus = status;
    },
    setSelectedQueryPreview(state, { query }) {
      state.query = query;
    }
  },
  actions: {
    setUrlParams,
    setInputStatus
  }
};
