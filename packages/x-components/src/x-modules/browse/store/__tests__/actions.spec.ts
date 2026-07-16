import type { StoreOptions } from 'vuex'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type { UrlParams } from '../../../../types/url-params'
import type { BrowseActions, BrowseGetters, BrowseMutations, BrowseState } from '../types'
import { mount } from '@vue/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Store } from 'vuex'
import { getBannersStub } from '../../../../__stubs__/banners-stubs.factory'
import { getBrowseResponseStub } from '../../../../__stubs__/browse-response-stubs.factory'
import { getEmptyBrowseResponseStub } from '../../../../__stubs__/empty-browse-response-stubs.factory'
import { getFacetsStub } from '../../../../__stubs__/facets-stubs.factory'
import { getPromotedsStub } from '../../../../__stubs__/promoteds-stubs.factory'
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { browseXStoreModule } from '../module'
import { resetBrowseStateWith } from './utils'

describe('testing browse module actions', () => {
  const resultsStub = getResultsStub()
  const facetsStub = getFacetsStub()
  const bannersStub = getBannersStub()
  const promotedsStub = getPromotedsStub()
  const browseResponseStub = getBrowseResponseStub()
  const emptyBrowseResponseStub = getEmptyBrowseResponseStub()

  const adapter = getMockedAdapter({ browse: browseResponseStub })

  const store: SafeStore<BrowseState, BrowseGetters, BrowseMutations, BrowseActions> = new Store(
    browseXStoreModule as unknown as StoreOptions<BrowseState>,
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
    resetBrowseStateWith(store)
    vi.clearAllMocks()
  })

  describe('fetchBrowseResponse', () => {
    it('should return browse response', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
      })

      const browseResponse = await store.dispatch('fetchBrowseResponse', store.getters.request!)
      expect(browseResponse).toEqual(browseResponseStub)
    })
  })

  describe('fetchAndSaveBrowseResponse', () => {
    it('should include the start and rows properties in the request', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
      })
      const { page, ...restRequest } = store.getters.request!
      await store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)

      expect(adapter.browse).toHaveBeenCalledTimes(1)
      expect(adapter.browse).toHaveBeenCalledWith({
        ...restRequest,
        start: 0,
        rows: 24,
      })
    })

    it('should calculate correctly the start and rows properties when pageMode config is set to infinite_scroll', async () => {
      resetBrowseStateWith(store, {
        config: { pageSize: 48, pageMode: 'infinite_scroll' },
        page: 2,
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        results: getResultsStub(48),
      })
      const { page, ...restRequest } = store.getters.request!
      await store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)

      expect(adapter.browse).toHaveBeenCalledTimes(1)
      expect(adapter.browse).toHaveBeenCalledWith({
        ...restRequest,
        start: 48,
        rows: 48,
      })
    })

    it('should calculate correctly the start and rows properties when pageMode config is set to pagination', async () => {
      resetBrowseStateWith(store, {
        config: { pageSize: 24, pageMode: 'pagination' },
        page: 2,
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        results: getResultsStub(48),
      })
      const { page, ...restRequest } = store.getters.request!
      await store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)

      expect(adapter.browse).toHaveBeenCalledTimes(1)
      expect(adapter.browse).toHaveBeenCalledWith({
        ...restRequest,
        start: 24,
        rows: 24,
      })
    })

    it('should request and store results, facets, banners, promoteds and browse tagging in the state', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
      })

      const actionPromise = store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)
      expect(store.state.status).toEqual('loading')
      await actionPromise
      expect(store.state.results).toEqual(resultsStub)
      expect(store.state.facets).toEqual(facetsStub)
      expect(store.state.banners).toEqual(bannersStub)
      expect(store.state.promoteds).toEqual(promotedsStub)
      expect(store.state.page).toEqual(1)
      expect(store.state.config.pageSize).toEqual(24)
      expect(store.state.status).toEqual('success')
      expect(store.state.browseTagging).toEqual(browseResponseStub.browseTagging)
    })

    it('should set undefined response values to their default values', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
      })
      adapter.browse.mockResolvedValueOnce({
        ...browseResponseStub,
        banners: undefined,
        promoteds: undefined,
      })

      await store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)
      expect(store.state.results).toEqual(resultsStub)
      expect(store.state.facets).toEqual(facetsStub)
      expect(store.state.banners).toEqual([])
      expect(store.state.promoteds).toEqual([])
      expect(store.state.page).toEqual(1)
      expect(store.state.config.pageSize).toEqual(24)
      expect(store.state.status).toEqual('success')
      expect(store.state.browseTagging).toEqual(browseResponseStub.browseTagging)
    })

    it('should request and store total results in the state', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
      })

      adapter.browse.mockResolvedValueOnce({
        ...emptyBrowseResponseStub,
        totalResults: 116,
      })

      const actionPromise = store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)
      await actionPromise
      expect(store.state.totalResults).toBe(116)
    })

    it('should clear the total results in the state', async () => {
      resetBrowseStateWith(store)
      const actionPromise = store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)
      await actionPromise
      expect(store.state.totalResults).toBe(0)
    })

    it('should cancel the previous request if it is not yet resolved', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'midi dress',
          browseField: 'description',
        },
      })
      const {
        results: initialResults,
        facets: initialFacets,
        banners: initialBanners,
        promoteds: initialPromoteds,
      } = store.state
      adapter.browse.mockResolvedValueOnce({
        ...emptyBrowseResponseStub,
        results: resultsStub.slice(0, 1),
        facets: facetsStub.slice(0, 1),
      })

      const firstRequest = store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)
      const secondRequest = store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)

      await firstRequest
      expect(store.state.status).toEqual('loading')
      expect(store.state.results).toBe(initialResults)
      expect(store.state.facets).toBe(initialFacets)
      expect(store.state.banners).toEqual(initialBanners)
      expect(store.state.promoteds).toEqual(initialPromoteds)
      expect(store.state.promoteds).toEqual(initialPromoteds)
      await secondRequest
      expect(store.state.status).toEqual('success')
      expect(store.state.results).toEqual(resultsStub)
      expect(store.state.facets).toEqual(facetsStub)
      expect(store.state.banners).toEqual(bannersStub)
      expect(store.state.promoteds).toEqual(promotedsStub)
    })

    it('should set the status to error when it fails', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
      })
      adapter.browse.mockRejectedValueOnce('Generic error')
      const { results, facets, banners, promoteds } = store.state
      await store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)

      expect(store.state.results).toBe(results)
      expect(store.state.facets).toBe(facets)
      expect(store.state.banners).toBe(banners)
      expect(store.state.promoteds).toBe(promoteds)
      expect(store.state.status).toEqual('error')
    })
  })

  describe('saveBrowseResponse', () => {
    it('saves the browse response in the browse state', async () => {
      await store.dispatch('saveBrowseResponse', {
        ...browseResponseStub,
      })
      expect(store.state.results).toEqual(resultsStub)
      expect(store.state.facets).toEqual(facetsStub)
      expect(store.state.banners).toEqual(bannersStub)
      expect(store.state.promoteds).toEqual(promotedsStub)
      expect(store.state.page).toEqual(1)
      expect(store.state.config.pageSize).toEqual(24)
      expect(store.state.browseTagging).toEqual(browseResponseStub.browseTagging)
    })

    it('saves default values of optional or undefined response properties in the browse state', async () => {
      await store.dispatch('saveBrowseResponse', {
        ...browseResponseStub,
        banners: undefined,
        promoteds: undefined,
      })
      expect(store.state.results).toEqual(resultsStub)
      expect(store.state.facets).toEqual(facetsStub)
      expect(store.state.banners).toEqual([])
      expect(store.state.promoteds).toEqual([])
      expect(store.state.page).toEqual(1)
      expect(store.state.config.pageSize).toEqual(24)
      expect(store.state.browseTagging).toEqual(browseResponseStub.browseTagging)
    })

    it('sets the isNoResults flag when there is no results', async () => {
      expect(store.state.isNoResults).toEqual(false)
      await store.dispatch('saveBrowseResponse', {
        ...emptyBrowseResponseStub,
      })
      expect(store.state.isNoResults).toEqual(true)
      await store.dispatch('saveBrowseResponse', {
        ...browseResponseStub,
      })
      expect(store.state.isNoResults).toEqual(false)
    })

    it('sets the FromNoResultsWithFilters flag when there is no results with filters applied', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'with filters',
          browseField: 'request',
        },
        selectedFilters: { brand: [{ id: 'test', selected: true, modelName: 'SimpleFilter' }] },
      })
      expect(store.state.fromNoResultsWithFilters).toEqual(false)
      await store.dispatch('saveBrowseResponse', {
        ...emptyBrowseResponseStub,
      })
      expect(store.state.fromNoResultsWithFilters).toEqual(true)
      await store.dispatch('saveBrowseResponse', {
        ...browseResponseStub,
      })
    })
  })

  describe('cancelFetchAndSaveBrowseResponse', () => {
    it('should cancel the request and do not modify the stored results', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
      })
      const {
        results: previousResults,
        facets: previousFacets,
        banners: previousBanners,
        promoteds: previousPromoteds,
      } = store.state
      await Promise.all([
        store.dispatch('fetchAndSaveBrowseResponse', store.getters.request),
        store.dispatch('cancelFetchAndSaveBrowseResponse'),
      ])
      expect(store.state.results).toEqual(previousResults)
      expect(store.state.facets).toEqual(previousFacets)
      expect(store.state.banners).toEqual(previousBanners)
      expect(store.state.promoteds).toEqual(previousPromoteds)
      expect(store.state.status).toEqual('success')
    })
  })

  describe('increasePageAppendingResults', () => {
    it('should increases by one the current page of the browse module', async () => {
      resetBrowseStateWith(store, { totalResults: 100 })

      await store.dispatch('increasePageAppendingResults')

      expect(store.state.page).toEqual(2)
    })

    it('should not increases the current page of the browse module if there not more results', async () => {
      resetBrowseStateWith(store, { totalResults: 48, page: 1, config: { pageSize: 24 } })

      await store.dispatch('increasePageAppendingResults')
      expect(store.state.page).toEqual(2)

      await store.dispatch('increasePageAppendingResults')
      expect(store.state.page).toEqual(2)
    })

    it('should increase page if the last page has less results than the page size', async () => {
      resetBrowseStateWith(store, { totalResults: 47, page: 1, config: { pageSize: 24 } })

      await store.dispatch('increasePageAppendingResults')
      expect(store.state.page).toEqual(2)
    })

    it('should increase page if the last page has only one result', async () => {
      resetBrowseStateWith(store, { totalResults: 25, page: 1, config: { pageSize: 24 } })

      await store.dispatch('increasePageAppendingResults')
      expect(store.state.page).toEqual(2)
    })

    it('appends results to the state when the page increases and the isAppendResults is true', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        results: resultsStub.slice(0, 1),
        banners: bannersStub.slice(0, 1),
        promoteds: promotedsStub.slice(0, 1),
        isAppendResults: true,
      })

      adapter.browse.mockResolvedValueOnce({
        ...emptyBrowseResponseStub,
        results: resultsStub.slice(1, 2),
        banners: bannersStub.slice(0, 1),
        promoteds: promotedsStub.slice(1, 2),
      })

      await store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)

      expect(store.state.results).toEqual(resultsStub.slice(0, 2))
      expect(store.state.banners).toEqual(bannersStub.slice(0, 1))
      expect(store.state.promoteds).toEqual(promotedsStub.slice(0, 1))
    })

    it('overrides results, banners and promoteds to the state when the page increases and the isAppendResults is false', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        results: resultsStub.slice(0, 1),
        banners: bannersStub.slice(0, 1),
        promoteds: promotedsStub.slice(0, 1),
        isAppendResults: false,
      })

      adapter.browse.mockResolvedValueOnce({
        ...emptyBrowseResponseStub,
        results: resultsStub.slice(1, 2),
        banners: bannersStub.slice(1, 2),
        promoteds: promotedsStub.slice(1, 2),
      })

      await store.dispatch('fetchAndSaveBrowseResponse', store.getters.request)

      expect(store.state.results).toEqual(resultsStub.slice(1, 2))
      expect(store.state.banners).toEqual(bannersStub.slice(1, 2))
      expect(store.state.promoteds).toEqual(promotedsStub.slice(1, 2))
    })
  })

  describe('resetState', () => {
    // Note that the following tests are meant for the resetState action, which
    // does not modify all fields but only some of them.
    it('should not reset the page when the page parameter of the request changes', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 2,
      })
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'floral midi dress',
          browseField: 'description',
          page: 3,
        },
        oldRequest: store.getters.request!,
      })

      expect(store.state).toEqual(
        expect.objectContaining<Partial<BrowseState>>({
          page: 2,
          params: {},
          selectedCategory: {
            browseValue: 'floral midi dress',
            browseField: 'description',
          },
          selectedFilters: {},
          sort: '',
        }),
      )
    })

    it('should not reset the page nor the sort when there are no changes', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 2,
        sort: 'desc',
      })
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'floral midi dress',
          browseField: 'description',
          page: 2,
          sort: 'desc',
        },
        oldRequest: store.getters.request!,
      })

      expect(store.state).toEqual(
        expect.objectContaining<Partial<BrowseState>>({
          page: 2,
          params: {},
          selectedCategory: {
            browseValue: 'floral midi dress',
            browseField: 'description',
          },
          selectedFilters: {},
          sort: 'desc',
        }),
      )
    })

    it('should reset the page when the selected category changes', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 2,
      })
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'dress',
          browseField: 'categoryIds',
          page: 2,
        },
        oldRequest: store.getters.request!,
      })

      expect(store.state).toEqual(
        expect.objectContaining<Partial<BrowseState>>({
          page: 1,
          params: {},
          selectedCategory: {
            browseValue: 'floral midi dress',
            browseField: 'description',
          },
          selectedFilters: {},
          sort: '',
        }),
      )
    })

    it('should reset the page when the sort changes', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 2,
      })
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'floral midi dress',
          browseField: 'description',
          page: 2,
          sort: 'desc',
        },
        oldRequest: store.getters.request!,
      })

      expect(store.state).toEqual(
        expect.objectContaining<Partial<BrowseState>>({
          page: 1,
          params: {},
          selectedCategory: {
            browseValue: 'floral midi dress',
            browseField: 'description',
          },
          selectedFilters: {},
          sort: '',
        }),
      )
    })

    it('should reset the page when the filters change', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 2,
      })
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'floral midi dress',
          browseField: 'description',
          page: 2,
          filters: {
            age_facet: [
              {
                id: '{!tag=age_facet}age_facet:"toddler"',
                modelName: 'SimpleFilter',
                selected: true,
              },
            ],
          },
        },
        oldRequest: store.getters.request!,
      })

      expect(store.state).toEqual(
        expect.objectContaining<Partial<BrowseState>>({
          page: 1,
          params: {},
          selectedCategory: {
            browseValue: 'floral midi dress',
            browseField: 'description',
          },
          selectedFilters: {},
          sort: '',
        }),
      )
    })

    it('should not reset the sort when the selected category does not change', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 1,
        sort: 'price asc',
      })
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'floral midi dress',
          browseField: 'description',
          page: 1,
        },
        oldRequest: store.getters.request!,
      })

      expect(store.state).toEqual(
        expect.objectContaining<Partial<BrowseState>>({
          page: 1,
          params: {},
          selectedCategory: {
            browseValue: 'floral midi dress',
            browseField: 'description',
          },
          selectedFilters: {},
          sort: 'price asc',
        }),
      )
    })

    it('should reset the page and sort when any extra param of the request changes', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 2,
        sort: 'price asc',
        params: {
          catalog: 'es',
        },
      })
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'floral midi dress',
          browseField: 'description',
          page: 2,
          extraParams: {
            catalog: 'pt',
          },
        },
        oldRequest: store.getters.request!,
      })

      expect(store.state).toEqual(
        expect.objectContaining<Partial<BrowseState>>({
          page: 1,
          params: {
            catalog: 'es',
          },
          selectedCategory: {
            browseValue: 'floral midi dress',
            browseField: 'description',
          },
          selectedFilters: {},
          sort: '',
        }),
      )
    })

    it('should reset the FromNoResultsWithFilters flag when there is already results in the state and the flag is true', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'with filters',
          browseField: 'request',
        },
        fromNoResultsWithFilters: true,
        results: getResultsStub(),
      })
      expect(store.state.fromNoResultsWithFilters).toEqual(true)
      await store.dispatch('resetRequestOnRefinement', {
        newRequest: {
          browseValue: 'with filters',
          browseField: 'request',
          page: 1,
        },
        oldRequest: store.getters.request!,
      })
      expect(store.state.fromNoResultsWithFilters).toEqual(false)
    })
  })

  describe('setUrlParams', () => {
    it('should set the params of the browse module when the selected category is the same', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'floral midi dress',
          browseField: 'description',
        },
        page: 1,
        sort: '',
      })

      await store.dispatch('setUrlParams', {
        browseValue: 'floral midi dress',
        browseField: 'description',
        page: 2,
        sort: 'priceSort asc',
      } as UrlParams)

      expect(store.state.selectedCategory.browseField).toEqual('description')
      expect(store.state.selectedCategory.browseValue).toEqual('floral midi dress')
      expect(store.state.page).toEqual(2)
      expect(store.state.sort).toEqual('priceSort asc')
    })

    it('should set the params of the browse module, except page, when the selected category is different', async () => {
      resetBrowseStateWith(store, {
        selectedCategory: {
          browseValue: 'dress',
          browseField: 'categoryIds',
        },
        page: 1,
        sort: '',
      })

      await store.dispatch('setUrlParams', {
        browseValue: 'floral midi dress',
        browseField: 'description',
        page: 2,
        sort: 'priceSort asc',
      } as UrlParams)

      expect(store.state.selectedCategory.browseValue).toEqual('floral midi dress')
      expect(store.state.selectedCategory.browseField).toEqual('description')
      expect(store.state.page).toEqual(1)
      expect(store.state.sort).toEqual('priceSort asc')
    })

    it('should set in the browse module the sort value even if empty', async () => {
      resetBrowseStateWith(store, { sort: 'priceSort asc' })

      await store.dispatch('setUrlParams', { page: 1, sort: '' } as UrlParams)

      expect(store.state.sort).toEqual('')
      expect(store.state.page).toEqual(1)
    })
  })
})
