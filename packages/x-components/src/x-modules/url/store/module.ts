import { UrlXStoreModule } from './types';
import { urlParams } from './getters/url-params.getter';

/**
 * {@link XStoreModule} For the URL module.
 *
 * @internal
 */
export const urlXStoreModule: UrlXStoreModule = {
  state: () => ({
    query: '',
    page: 1,
    filters: [],
    sort: '',
    relatedTags: []
  }),
  getters: {
    urlParams
  },
  mutations: {},
  actions: {}
};
