import { urlMappedParamNames } from './getters/url-mapped-param-names.getter';
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
      urlParamNames: {
        relatedTags: 'tag'
      }
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
    setRelatedTags(state, relatedTags) {
      state.params.relatedTags = relatedTags.map(r => r.tag);
    }
  },
  actions: {
    updateUrl,
    updateStoreFromUrl
  }
};
