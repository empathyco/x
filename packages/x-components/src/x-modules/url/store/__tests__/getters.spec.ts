import { UrlGetters } from '../types';
import { createUrlStore } from './utils';

describe('testing URL module getters', () => {
  describe('testing urlParams getter', () => {
    const store = createUrlStore({
      config: {
        urlParamNames: {
          query: 'q',
          relatedTags: 'tag'
        }
      },
      query: 'salmorejo',
      filters: [],
      relatedTags: ['with eggs'],
      page: 1,
      sort: 'default',
      extraParams: {
        warehouse: 12345,
        store: ''
      }
    });
    it('re-maps values using the config', () => {
      expect(store.getters.urlParams).toEqual<UrlGetters['urlParams']>({
        query: 'salmorejo',
        relatedTags: ['with eggs'],
        sort: 'default',
        warehouse: 12345
      });
    });
    it('maps the param key from the stete with the config one or itself', () => {
      expect(store.getters.urlMappedParamNames).toEqual<UrlGetters['urlMappedParamNames']>({
        query: 'q',
        filters: 'filters',
        relatedTags: 'tag',
        page: 'page',
        sort: 'sort',
        warehouse: 'warehouse',
        store: 'store'
      });
    });
  });
});
