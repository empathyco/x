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
        query: 'ebq',
        relatedTags: 'tag'
      }
    },
    query: '',
    page: 2,
    filters: [],
    sort: '',
    relatedTags: [],
    extraParams: {
      patata: '',
      store: ''
    }
  }),
  getters: {
    urlParams
  },
  mutations: {
    setUrlConfig(state, urlConfig) {
      state.config = urlConfig;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setRelatedTags(state, relatedTags) {
      state.relatedTags = relatedTags;
    },
    setExtraParams(state, extraParam) {
      state.extraParams = { ...state.extraParams, ...extraParam };
    }
  },
  actions: {
    updateUrl,
    updateStoreFromUrl
  }
};
