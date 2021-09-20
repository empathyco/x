import { urlMappedParamNames } from './getters/url-mapped-param-names.getter';
import { urlParams } from './getters/url-params.getter';
import { UrlXStoreModule } from './types';
import { updateUrl } from './actions/update-url.action';
import { updateStoreFromUrl } from './actions/update-store-from-url.action';

/**
 * {@link XStoreModule} For the URL module.
 *
 * @internal
 */
export const urlXStoreModule: UrlXStoreModule = {
  state: () => ({
    config: {
      urlParamNames: {}
    },
    params: {
      query: '',
      page: 1,
      filters: [],
      sort: '',
      scroll: 0,
      relatedTags: []
    },
    extraParams: {
      store: ''
    }
  }),
  getters: {
    urlParams,
    urlMappedParamNames
  },
  mutations: {
    setUrlConfig(state, urlConfig) {
      state.config = urlConfig;
    },
    setExtraParams(state, extraParam) {
      state.extraParams = { ...state.extraParams, ...extraParam };
    },
    setParams(state, params) {
      state.params = { ...state.params, ...params };
    },
    setQuery(state, query) {
      state.params.query = query;
    }
  },
  actions: {
    updateUrl,
    updateStoreFromUrl
  }
};
