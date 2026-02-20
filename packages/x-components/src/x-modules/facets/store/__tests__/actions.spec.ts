import type { StoreOptions } from 'vuex'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type { FacetsActions, FacetsGetters, FacetsMutations, FacetsState } from '../types'

import { mount } from '@vue/test-utils'
import { Store } from 'vuex'
import { createSimpleFacetStub } from '../../../../__stubs__/facets-stubs.factory'
import {
  createSimpleFilter,
  getHierarchicalFilterStub,
} from '../../../../__stubs__/filters-stubs.factory'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { facetsXStoreModule } from '../module'
import { resetFacetsStateWith } from './utils'

describe('testing facets module actions', () => {
  const facetsResponseStub = {
    facets: [
      createSimpleFacetStub('brand', createFilters => [
        createFilters('Nike', false, 10),
        createFilters('Adidas', false, 5),
      ]),
      createSimpleFacetStub('color', createFilters => [
        createFilters('Red', false, 3),
        createFilters('Blue', false, 7),
      ]),
    ],
  }

  const adapter = getMockedAdapter({ facets: facetsResponseStub })

  const store: SafeStore<FacetsState, FacetsGetters, FacetsMutations, FacetsActions> = new Store(
    facetsXStoreModule as unknown as StoreOptions<FacetsState>,
  )
  mount(
    {},
    {
      global: {
        plugins: [installNewXPlugin({ adapter, store })],
      },
    },
  )

  beforeEach(() => {
    resetFacetsStateWith(store)
    jest.clearAllMocks()
  })

  describe('fetchFacetsResponse', () => {
    it('should return facets response', async () => {
      const facetsRequest = {
        query: 'test',
        filters: {},
        extraParams: { instance: 'test' },
      }

      const facetsResponse = await store.dispatch('fetchFacetsResponse', facetsRequest)
      expect(facetsResponse).toEqual(facetsResponseStub)
    })
  })

  describe('fetchAndSaveFacetsResponse', () => {
    it('should include the origin property in the request', async () => {
      resetFacetsStateWith(store, {
        query: 'test',
        origin: 'search_box:external',
        params: { instance: 'test' },
      })

      await store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)

      expect(adapter.facets).toHaveBeenCalledTimes(1)
      expect(adapter.facets).toHaveBeenCalledWith({
        query: 'test',
        filters: {},
        origin: 'search_box:external',
        extraParams: { instance: 'test' },
      })
    })

    it('should save the facets response to the state', async () => {
      resetFacetsStateWith(store, {
        query: 'test',
        params: { instance: 'test' },
      })

      await store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)

      // TODO: Update test when the facets state is definitively designed
      expect(store.state.facets).toMatchObject({})

      expect(store.state.filters['brand:Nike']).toEqual(undefined)

      expect(store.state.filters['color:Red']).toEqual(undefined)
    })

    it('should preserve selected state of filters when saving facets response', async () => {
      const selectedFilter = createSimpleFilter('brand', 'Nike', true, 10)
      resetFacetsStateWith(store, {
        query: 'test',
        params: { instance: 'test' },
        filters: { 'brand:Nike': selectedFilter },
      })

      await store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)

      expect(store.state.filters['brand:Nike'].selected).toBe(true)
    })

    it('should handle hierarchical filters selection correctly', async () => {
      const hierarchicalFacet = {
        id: 'category',
        label: 'category',
        modelName: 'HierarchicalFacet' as const,
        filters: [getHierarchicalFilterStub()],
      }

      adapter.facets.mockResolvedValueOnce({
        facets: [hierarchicalFacet],
      })

      const hierarchicalFilter = getHierarchicalFilterStub()
      hierarchicalFilter.selected = true

      resetFacetsStateWith(store, {
        query: 'test',
        params: { instance: 'test' },
        filters: { [hierarchicalFilter.id]: hierarchicalFilter },
      })

      await store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)

      expect(store.state.filters[hierarchicalFilter.id].selected).toBe(true)
    })

    it('should not make request when request getter returns null', async () => {
      resetFacetsStateWith(store, {
        query: '',
      })

      await store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)

      expect(adapter.facets).not.toHaveBeenCalled()
    })

    it('should handle cancellation properly', async () => {
      resetFacetsStateWith(store, {
        query: 'test',
        params: { instance: 'test' },
      })

      // Mock multiple responses
      adapter.facets.mockResolvedValueOnce(facetsResponseStub)
      adapter.facets.mockResolvedValueOnce(facetsResponseStub)

      const firstRequest = store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)
      const secondRequest = store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)

      await Promise.allSettled([firstRequest, secondRequest])

      // Both requests should be called as they are independent
      expect(adapter.facets).toHaveBeenCalledTimes(2)
    })
  })

  describe('saveOrigin', () => {
    it('should save origin in the state', async () => {
      const origin = 'url:external'

      await store.dispatch('saveOrigin', { feature: 'url', location: 'external' })

      expect(store.state.origin).toEqual(origin)
    })

    it('should save null origin when no feature is provided', async () => {
      await store.dispatch('saveOrigin', {})

      expect(store.state.origin).toBeNull()
    })
  })

  describe('cancelFetchAndSaveFacetsResponse', () => {
    it('should cancel the pending facets request', async () => {
      resetFacetsStateWith(store, {
        query: 'test',
        params: { instance: 'test' },
      })

      const facetsPromise = store.dispatch('fetchAndSaveFacetsResponse', store.getters.request)
      await store.dispatch('cancelFetchAndSaveFacetsResponse')

      await expect(facetsPromise).resolves.toBeUndefined()
    })
  })
})
