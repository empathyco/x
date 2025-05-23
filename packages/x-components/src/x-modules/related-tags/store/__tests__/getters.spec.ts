import type { RelatedTagsRequest } from '@empathyco/x-types'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type {
  RelatedTagsActions,
  RelatedTagsGetters,
  RelatedTagsMutations,
  RelatedTagsState,
} from '../types'
import { Store } from 'vuex'
import {
  createRelatedTagStub,
  getRelatedTagsStub,
} from '../../../../__stubs__/related-tags-stubs.factory'
import { relatedTagsXStoreModule } from '../module'
import { resetRelatedTagsStateWith } from './utils'

describe('testing related tags module getters', () => {
  const store: SafeStore<
    RelatedTagsState,
    RelatedTagsGetters,
    RelatedTagsMutations,
    RelatedTagsActions
  > = new Store(relatedTagsXStoreModule as any)

  beforeEach(() => {
    resetRelatedTagsStateWith(store)
  })

  describe(`request getter`, () => {
    it('should return a request object if there is a query', () => {
      resetRelatedTagsStateWith(store, {
        query: 'doraemon',
        params: {
          catalog: 'es',
        },
      })

      expect(store.getters.request).toEqual<RelatedTagsRequest>({
        query: 'doraemon',
        rows: 10,
        start: 0,
        extraParams: {
          catalog: 'es',
        },
      })
    })

    it('should return a request object with the selected related tags', () => {
      resetRelatedTagsStateWith(store, {
        query: 'nobita',
        selectedRelatedTags: [createRelatedTagStub('barça nobita', 'barça')],
        params: {
          warehouse: 1234,
        },
      })

      expect(store.getters.request).toEqual<RelatedTagsRequest>({
        query: 'barça nobita',
        rows: 10,
        start: 0,
        extraParams: {
          warehouse: 1234,
        },
      })
    })

    it('should return null when there is not query', () => {
      expect(store.getters.request).toBeNull()
    })

    it('should return null when there is an empty query', () => {
      resetRelatedTagsStateWith(store, {
        query: ' ',
      })
      expect(store.getters.request).toBeNull()
    })
  })

  describe(`relatedTags getter`, () => {
    it('should return the selected related tags with the related tags', () => {
      const selectedRelatedTags = [createRelatedTagStub('lego star wars', 'star wars')]
      const relatedTags = getRelatedTagsStub()
      resetRelatedTagsStateWith(store, {
        selectedRelatedTags,
        relatedTags,
      })
      expect(store.getters.relatedTags).toEqual([...selectedRelatedTags, ...relatedTags])
    })
  })

  describe('query getter', () => {
    it('returns the query when there are no selected related tags', () => {
      resetRelatedTagsStateWith(store, {
        query: ' rum ',
        relatedTags: getRelatedTagsStub(),
        selectedRelatedTags: [],
      })
      expect(store.getters.query).toEqual('rum')
    })

    it('returns an empty string if there is no query', () => {
      resetRelatedTagsStateWith(store, {
        query: ' \n',
        relatedTags: [],
        selectedRelatedTags: [createRelatedTagStub('summer shirt', 'summer')],
      })
      expect(store.getters.query).toEqual('')
    })

    it('returns the query and the selected related tags concatenated', () => {
      resetRelatedTagsStateWith(store, {
        query: 'shirt',
        relatedTags: [],
        selectedRelatedTags: [
          createRelatedTagStub('summer shirt', 'summer'),
          createRelatedTagStub('summer shirt men', 'men'),
        ],
      })
      expect(store.getters.query).toEqual('summer shirt men')
    })
  })
})
