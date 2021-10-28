import { urlParams } from './getters/url-params.getter';
import { initialUrlState } from './initial-state';
import { UrlXStoreModule } from './types';
import { updateStoreFromUrl } from './actions/update-store-from-url.action';

/**
 * {@link XStoreModule} For the URL module.
 *
 * @internal
 */
export const urlXStoreModule: UrlXStoreModule = {
  state: () => ({
    ...initialUrlState
  }),
  getters: {
    urlParams
  },
  mutations: {
    setExtraParams(state, extraParams) {
      state.extraParams = { ...state.extraParams, ...extraParams };
    },
    setParams(state, params) {
      state.params = { ...state.params, ...params };
    },
    setQuery(state, query) {
      state.params.query = query;
    },
    setRelatedTags(state, relatedTags) {
      state.params.tag = relatedTags.map(relatedTag => relatedTag.tag);
    },
    setFilters(state, newFilters) {
      state.params.filter = newFilters.map(filter => filter.id as string);
    },
    setPage(state, page) {
      state.params.page = page;
    }
  },
  actions: {
    updateStoreFromUrl
  }
};
