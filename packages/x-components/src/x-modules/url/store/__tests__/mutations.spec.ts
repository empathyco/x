import type { UrlParams } from '../../../../types/url-params'
import { describe, expect, it } from 'vitest'
import { createUrlStore } from './utils'

describe('testing Url module mutations', () => {
  const store = createUrlStore()

  describe('setParams', () => {
    it('should update the state with the correct url parameters', () => {
      const urlParams: Partial<UrlParams> = {
        query: 'sudadera',
        tag: ['capucha', 'disney'],
        page: 3,
        warehouse: '01234',
        consent: true,
      }
      store.commit('setParams', urlParams)

      expect(store.state).toEqual<Partial<UrlParams>>({
        page: 3,
        prompt: -1,
        query: 'sudadera',
        tag: ['capucha', 'disney'],
        filter: [],
        sort: '',
        scroll: '',
        warehouse: '01234',
        consent: true,
        browseValue: '',
        browseField: '',
        catalogSection: '',
        initialExtraParams: {},
      })
    })
  })

  describe('setCatalogSection', () => {
    it('should update the state with the correct catalog section', () => {
      store.commit('setCatalogSection', 'catalog-section-1')

      expect(store.state.catalogSection).toEqual('catalog-section-1')
    })
  })
})
