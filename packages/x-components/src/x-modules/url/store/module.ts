import { UrlXStoreModule } from './types';
import { urlParams } from './getters/url-params.getter';
import { updateUrl } from './actions/update-url.action';

/**
 * {@link XStoreModule} For the URL module.
 *
 * @internal
 */
export const urlXStoreModule: UrlXStoreModule = {
  state: () => ({
    config: {
      urlParamNames: {
        page: 'tortillas'
      }
    },
    query: '',
    page: 2,
    filters: [],
    sort: '',
    relatedTags: ['red1', 'red2'],
    extraParams: {
      beltran: 'eselmejor',
      guille: 'quepepinodegrafica'
    }
  }),
  getters: {
    urlParams
  },
  mutations: {
    setUrlConfig(state, urlConfig) {
      state.config = urlConfig;
    }
  },
  actions: {
    updateUrl
  }
};
