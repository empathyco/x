import type { SafeStore } from '../../../../store/__tests__/utils'
import type { VendorBanner, VendorResult } from '../../types'
import type {
  VendorActions,
  VendorGetters,
  VendorMutations,
  VendorState,
} from '../types'
import { describe, expect, it } from 'vitest'
import { Store } from 'vuex'
import { vendorXStoreModule } from '../module'

type VendorSafeStore = SafeStore<VendorState, VendorGetters, VendorMutations, VendorActions>

function createStore(): VendorSafeStore {
  return new Store(vendorXStoreModule as any)
}

function createVendorResultStub(
  id: string,
  result?: Partial<Omit<VendorResult, 'modelName'>>,
): VendorResult {
  return { id: `vr-${id}`, modelName: 'VendorResult', position: 1, ...result }
}

function createVendorBannerStub(
  id: string,
  banner?: Partial<Omit<VendorBanner, 'modelName' | 'image'>>,
): VendorBanner {
  return { id: `vb-${id}`, modelName: 'VendorBanner', image: `vb-${id}.jpg`, position: 1, ...banner }
}

describe('testing vendor module mutations', () => {
  describe('setQueryPreviewVendorResults', () => {
    it('saves the vendor results of the query preview with their modelName', () => {
      const store = createStore()
      const results = [createVendorResultStub('1'), createVendorResultStub('2', { position: 3 })]

      store.commit('setQueryPreviewVendorResults', { queryPreviewHash: 'hash', results })

      expect(store.state.queryPreviews.hash.results).toEqual(
        results.map(result => ({ ...result, modelName: 'VendorResult' })),
      )
    })

    it('preserves the vendor banners already saved for the query preview', () => {
      const store = createStore()
      const banners = [createVendorBannerStub('1')]
      store.commit('setQueryPreviewVendorBanners', { queryPreviewHash: 'hash', banners })

      store.commit('setQueryPreviewVendorResults', {
        queryPreviewHash: 'hash',
        results: [createVendorResultStub('1')],
      })

      expect(store.state.queryPreviews.hash).toEqual({
        results: [{ ...createVendorResultStub('1'), modelName: 'VendorResult' }],
        banners: [{ ...createVendorBannerStub('1'), modelName: 'VendorBanner' }],
      })
    })
  })

  describe('setQueryPreviewVendorBanners', () => {
    it('saves the vendor banners of the query preview with their modelName', () => {
      const store = createStore()
      const banners = [createVendorBannerStub('1'), createVendorBannerStub('2', { position: 3 })]

      store.commit('setQueryPreviewVendorBanners', { queryPreviewHash: 'hash', banners })

      expect(store.state.queryPreviews.hash.banners).toEqual(
        banners.map(banner => ({ ...banner, modelName: 'VendorBanner' })),
      )
    })

    it('preserves the vendor results already saved for the query preview', () => {
      const store = createStore()
      const results = [createVendorResultStub('1')]
      store.commit('setQueryPreviewVendorResults', { queryPreviewHash: 'hash', results })

      store.commit('setQueryPreviewVendorBanners', {
        queryPreviewHash: 'hash',
        banners: [createVendorBannerStub('1')],
      })

      expect(store.state.queryPreviews.hash).toEqual({
        results: [{ ...createVendorResultStub('1'), modelName: 'VendorResult' }],
        banners: [{ ...createVendorBannerStub('1'), modelName: 'VendorBanner' }],
      })
    })
  })

  describe('removeQueryPreviewVendorData', () => {
    it('removes the vendor results and banners of the query preview', () => {
      const store = createStore()
      store.commit('setQueryPreviewVendorResults', {
        queryPreviewHash: 'hash',
        results: [createVendorResultStub('1')],
      })
      store.commit('setQueryPreviewVendorBanners', {
        queryPreviewHash: 'hash',
        banners: [createVendorBannerStub('1')],
      })

      store.commit('removeQueryPreviewVendorData', 'hash')

      expect(store.state.queryPreviews.hash).toBeUndefined()
    })
  })
})
