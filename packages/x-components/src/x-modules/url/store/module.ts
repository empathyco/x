import { UrlXStoreModule } from './types';

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
    relatedTag: ''
  }),
  getters: {},
  mutations: {},
  actions: {}
};
