import { setQuery } from '../../../store/utils/query.utils';
import { setUrlParams } from './actions/set-url-params.action';
import { SearchBoxXStoreModule } from './types';

/**
 * {@link XStoreModule} For the search-box module.
 *
 * @internal
 */
export const searchBoxXStoreModule: SearchBoxXStoreModule = {
  state: () => ({
    query: ''
  }),
  getters: {
    trimmedQuery(state) {
      return state.query.trim();
    }
  },
  mutations: {
    setQuery
  },
  actions: {
    setUrlParams
  }
};
