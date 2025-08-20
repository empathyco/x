import type { AiQuestionsRequest } from '@empathyco/x-types'
import type { AiState } from '../types'
import { map } from '@empathyco/x-utils'
import { Store } from 'vuex'
import { aiXStoreModule } from '../module'
import { resetAiStateWith } from './utils'

describe('testing ai module getters', () => {
  const gettersKeys = map(aiXStoreModule.getters, getter => getter)
  const store: Store<AiState> = new Store(aiXStoreModule as any)

  beforeEach(() => {
    resetAiStateWith(store)
  })

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object if there is a query', () => {
      resetAiStateWith(store, {
        query: 'ai cheese',
        params: { catalog: 'en' },
      })

      expect(store.getters[gettersKeys.request]).toEqual<AiQuestionsRequest>({
        query: 'ai cheese',
        extraParams: { catalog: 'en' },
      })
    })

    it('should return null when there is no query', () => {
      expect(store.getters[gettersKeys.request]).toBeNull()
    })
  })
})
