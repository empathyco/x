import type { UrlGetters } from '../types'
import { createUrlStore, resetUrlStateWith } from './utils'

describe('testing url module getters', () => {
  const store = createUrlStore({
    query: 'salmorejo',
    filter: [],
    tag: ['with eggs'],
    page: 1,
    sort: 'default',
    scroll: '',
    warehouse: 12345,
    store: '',
  })

  it('re-maps values using the config', () => {
    expect(store.getters.urlParams).toEqual<Partial<UrlGetters['urlParams']>>({
      query: 'salmorejo',
      tag: ['with eggs'],
      sort: 'default',
      warehouse: 12345,
    })
  })

  it('removes all the parameters from the url that are the default values in the state', () => {
    resetUrlStateWith(store, {
      page: 2,
      query: 'doramion',
      scroll: '444',
    })

    expect(store.getters.urlParams).toEqual<Partial<UrlGetters['urlParams']>>({
      query: 'doramion',
      page: 2,
      scroll: '444',
    })

    resetUrlStateWith(store, { page: 1, query: 'lego', scroll: '' })

    expect(store.getters.urlParams).toEqual<Partial<UrlGetters['urlParams']>>({
      query: 'lego',
    })
  })

  it('removes all the empty extra params', () => {
    resetUrlStateWith(store, { query: 'doramion', warehouse: '11111' })

    expect(store.getters.urlParams).toEqual<Partial<UrlGetters['urlParams']>>({
      query: 'doramion',
      warehouse: '11111',
    })

    resetUrlStateWith(store, { query: 'doramion', warehouse: '' })

    expect(store.getters.urlParams).toEqual<Partial<UrlGetters['urlParams']>>({
      query: 'doramion',
    })
  })
})
