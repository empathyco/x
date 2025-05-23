import type { PopularSearchesRequest } from '@empathyco/x-types'
import type { PopularSearchesState } from '../types'
import { map } from '@empathyco/x-utils'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex'
import { createHistoryQueries } from '../../../../__stubs__/history-queries-stubs.factory'
import { getPopularSearchesStub } from '../../../../__stubs__/popular-searches-stubs.factory'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { popularSearchesXStoreModule } from '../module'
import { resetPopularSearchesStateWith } from './utils'

describe('testing popular searches module getters', () => {
  const gettersKeys = map(popularSearchesXStoreModule.getters, getter => getter)
  const store: Store<PopularSearchesState> = new Store(popularSearchesXStoreModule as any)

  describe(`${gettersKeys.request} getter`, () => {
    it('should return a request object with config default values', () => {
      resetPopularSearchesStateWith(store, {
        config: { maxItemsToRequest: 3 },
        params: {
          catalog: 'es',
        },
      })
      expect(store.getters[gettersKeys.request]).toEqual<PopularSearchesRequest>({
        rows: 3,
        start: 0,
        extraParams: {
          catalog: 'es',
        },
      })
    })
  })

  describe(`${gettersKeys.popularSearches} getter`, () => {
    const searchedQueries = createHistoryQueries('limes')
    const mockedPopularSearches = getPopularSearchesStub()

    const adapter = getMockedAdapter({
      popularSearches: { suggestions: mockedPopularSearches },
    })
    mount(
      {},
      {
        global: {
          plugins: [installNewXPlugin({ adapter, store })],
        },
      },
    )

    it('should return the popular searches without the previously searched queries', () => {
      resetPopularSearchesStateWith(store, {
        searchedQueries,
        popularSearches: mockedPopularSearches,
        config: {
          maxItemsToRequest: 5,
          hideSessionQueries: true,
        },
      })
      expect(store.getters[gettersKeys.popularSearches]).toEqual(
        mockedPopularSearches.filter(popularSearch => popularSearch.query !== 'limes'),
      )
    })

    it('should return all popular searches if hideSessionQueries is false', () => {
      resetPopularSearchesStateWith(store, {
        searchedQueries,
        popularSearches: mockedPopularSearches,
        config: {
          maxItemsToRequest: 5,
          hideSessionQueries: false,
        },
      })
      expect(store.getters[gettersKeys.popularSearches]).toEqual(mockedPopularSearches)
    })
  })
})
