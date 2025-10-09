import type { AiSuggestionsRequest } from '@empathyco/x-types'
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

  describe(`${gettersKeys.suggestionsRequest} getter`, () => {
    it('should return a request object', () => {
      resetAiStateWith(store, {
        query: 'ai cheese',
        params: { catalog: 'en' },
      })

      expect(store.getters[gettersKeys.suggestionsRequest]).toEqual<AiSuggestionsRequest>({
        query: 'ai cheese',
        extraParams: { catalog: 'en' },
        filters: {},
      })
    })
  })
})
