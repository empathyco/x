import type { SafeStore } from '../../../../store/__tests__/utils'
import type { InternalBrowseRequest } from '../../types'
import type { BrowseActions, BrowseGetters, BrowseMutations, BrowseState } from '../types'
import { beforeEach, describe, expect, it } from 'vitest'
import { Store } from 'vuex'
import { browseXStoreModule } from '../module'
import { resetBrowseStateWith } from './utils'

describe('testing browse module getters', () => {
  const store: SafeStore<BrowseState, BrowseGetters, BrowseMutations, BrowseActions> = new Store(
    browseXStoreModule as any,
  )

  beforeEach(() => {
    resetBrowseStateWith(store)
  })

  describe(`request getter`, () => {
    it('should return a request object if there is a selected category with module properties', () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseField: 'description',
          browseValue: 'doraemon',
        },
        page: 3,
        params: {
          catalog: 'es',
        },
      })

      expect(store.getters.request).toEqual<InternalBrowseRequest>({
        browseField: 'description',
        browseValue: 'doraemon',
        filters: {},
        sort: '',
        page: 3,
        extraParams: {
          catalog: 'es',
        },
      })
    })

    it('should return null when there is not selected category', () => {
      expect(store.getters.request).toBeNull()
    })

    it('should return null when there is an empty selected category values', () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseField: ' ',
          browseValue: ' ',
        },
      })
      expect(store.getters.request).toBeNull()
    })
  })

  describe('selected category getter', () => {
    it('returns null if the query is only whitespace', () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseField: 'description',
          browseValue: ' \n',
        },
      })
      expect(store.getters.request).toBeNull()
    })
  })
})
