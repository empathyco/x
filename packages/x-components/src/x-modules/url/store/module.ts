import { urlParams } from './getters/url-params.getter';
import { UrlState, UrlXStoreModule } from './types';
import { updateStoreFromUrl } from './actions/update-store-from-url.action';

/**
 * The initial state of the Url store module. This is exported and used in other parts of the code
 * to use as default values for {@link UrlState}.
 *
 * @internal
 */
export const initialUrlState: UrlState = {
  params: {
    query: '',
    page: 1,
    filter: [],
    sort: '',
    scroll: 0,
    tag: []
  },
  extraParams: {}
};

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
    setExtraParams(state, extraParam) {
      state.extraParams = { ...state.extraParams, ...extraParam };
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
