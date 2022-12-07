import { setQuery } from '../../../store/utils/query.utils';
import { setUrlParams } from './actions/set-url-params.action';
import { SearchBoxXStoreModule } from './types';
import { setStatus } from './actions/set-status.action';

/**
 * {@link XStoreModule} For the search-box module.
 *
 * @internal
 */
export const searchBoxXStoreModule: SearchBoxXStoreModule = {
  state: () => ({
    query: '',
    status: 'initial'
  }),
  getters: {
    trimmedQuery(state) {
      return state.query.trim();
    }
  },
  mutations: {
    setQuery,
    setStatus(state, status) {
      state.status = status;
    }
  },
  actions: {
    setUrlParams,
    setStatus
  }
};
