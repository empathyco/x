import type { RelatedPromptsRequest } from '@empathyco/x-types'
import type { RelatedPromptsState } from '../types'
import { map } from '@empathyco/x-utils'
import { Store } from 'vuex'
import { relatedPromptsXStoreModule } from '../module'
import { resetRelatedPromptsStateWith } from './utils'

describe('testing related prompts module getters', () => {
  const gettersKeys = map(relatedPromptsXStoreModule.getters, getter => getter)
  const store: Store<RelatedPromptsState> = new Store(relatedPromptsXStoreModule as any)

  beforeEach(() => {
    resetRelatedPromptsStateWith(store)
  })

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetRelatedPromptsStateWith(store, {
        query: 'queso',
        params: {
          catalog: 'es',
        },
      })

      expect(store.getters[gettersKeys.request]).toEqual<RelatedPromptsRequest>({
        query: 'queso',
        extraParams: {
          catalog: 'es',
        },
      })
    })

    it('should return null when there is not query', () => {
      expect(store.getters[gettersKeys.request]).toBeNull()
    })
  })
})
