import type { SemanticQueriesRequest } from '@empathyco/x-types'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type {
  SemanticQueriesActions,
  SemanticQueriesGetters,
  SemanticQueriesMutations,
  SemanticQueriesState,
} from '../types'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex'
import { getSemanticQueriesStub } from '../../../../__stubs__/semantic-queries-stubs.factory'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { semanticQueriesXStoreModule } from '../module'
import { resetSemanticQueriesStateWith } from './utils'

describe('semantic queries actions tests', () => {
  const semanticQueriesStub = getSemanticQueriesStub()

  const adapter = getMockedAdapter({
    semanticQueries: semanticQueriesStub,
  })

  const store: SafeStore<
    SemanticQueriesState,
    SemanticQueriesGetters,
    SemanticQueriesMutations,
    SemanticQueriesActions
  > = new Store(semanticQueriesXStoreModule as any)

  mount(
    {},
    {
      global: {
        plugins: [installNewXPlugin({ adapter, store })],
      },
    },
  )

  beforeEach(() => {
    resetSemanticQueriesStateWith(store)
    jest.clearAllMocks()
  })

  describe('fetchSemanticQuery', () => {
    it('should make a semantic queries request', async () => {
      const request: SemanticQueriesRequest = {
        query: 'test',
        extraParams: {
          lang: 'en',
        },
      }

      const results = await store.dispatch('fetchSemanticQuery', request)

      expect(adapter.semanticQueries).toHaveBeenCalledTimes(1)
      expect(adapter.semanticQueries).toHaveBeenCalledWith(request)
      expect(results).toEqual(semanticQueriesStub)
    })

    it('should return null if the request is null or there is no query', async () => {
      let results = await store.dispatch('fetchSemanticQuery', null)

      expect(adapter.semanticQueries).not.toHaveBeenCalled()
      expect(results).toBeNull()

      results = await store.dispatch('fetchSemanticQuery', {
        query: '',
        extraParams: {
          lang: 'en',
        },
      })

      expect(adapter.semanticQueries).not.toHaveBeenCalled()
      expect(results).toBeNull()
    })
  })

  describe('fetchAndSaveSemanticQueries', () => {
    it('should fetch and save the semantic queries to the state', async () => {
      const request = {
        query: 'test',
        extraParams: {
          lang: 'en',
        },
      }

      adapter.semanticQueries.mockResolvedValueOnce({
        semanticQueries: [
          {
            modelName: 'SemanticQuery',
            query: 'test',
            distance: 1,
          },
          {
            modelName: 'SemanticQuery',
            query: 'test',
            distance: 2,
          },
        ],
      })

      await store.dispatch('fetchAndSaveSemanticQuery', request)

      expect(store.state.semanticQueries).toEqual([
        {
          modelName: 'SemanticQuery',
          query: 'test',
          distance: 1,
        },
        {
          modelName: 'SemanticQuery',
          query: 'test',
          distance: 2,
        },
      ])

      await store.dispatch('fetchAndSaveSemanticQuery', null)

      expect(store.state.semanticQueries).toEqual([])
    })
  })
})
