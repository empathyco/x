import { UrlXStoreModule } from './types';
import { urlParams } from './getters/url-params.getter';
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
      relatedTags: []
    },
    extraParams: {}
  }),
  getters: {
    urlParams
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
    }
  },
  actions: {
    updateUrl,
    updateStoreFromUrl
  }
};
