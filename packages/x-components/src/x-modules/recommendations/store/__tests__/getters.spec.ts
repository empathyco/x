import type { RecommendationsRequest } from '@empathyco/x-types'
import type { RecommendationsState } from '../types'
import { map } from '@empathyco/x-utils'
import { Store } from 'vuex'
import { RECOMMENDATIONS_ORIGIN } from '../constants'
import { recommendationsXStoreModule } from '../module'
import { resetRecommendationsStateWith } from './utils'

describe('testing recommendations module getters', () => {
  const gettersKeys = map(recommendationsXStoreModule.getters, getter => getter)
  const store: Store<RecommendationsState> = new Store(recommendationsXStoreModule as any)

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object with config default values', () => {
      resetRecommendationsStateWith(store, {
        config: { maxItemsToRequest: 3 },
        params: { catalog: 'es' },
      })
      expect(store.getters[gettersKeys.request]).toEqual<RecommendationsRequest>({
        rows: 3,
        start: 0,
        origin: RECOMMENDATIONS_ORIGIN,
        extraParams: {
          catalog: 'es',
        },
      })
    })
  })
})
