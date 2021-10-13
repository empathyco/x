import { UrlGetters } from '../types';
import { createUrlStore } from './utils';

describe('testing url module getters', () => {
  const store = createUrlStore({
    params: {
      query: 'salmorejo',
      filter: [],
      tag: ['with eggs'],
      page: 1,
      sort: 'default',
      scroll: 0
    },
    extraParams: {
      warehouse: 12345,
      store: ''
    }
  });

  it('re-maps values using the config', () => {
    expect(store.getters.urlParams).toEqual<Partial<UrlGetters['urlParams']>>({
      query: 'salmorejo',
      tag: ['with eggs'],
      sort: 'default',
      warehouse: 12345
    });
  });
});
