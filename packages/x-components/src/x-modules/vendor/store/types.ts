import type { XStoreModule } from '../../../store'
import type { VendorBanner, VendorResult } from '../types'

export interface VendorState {
  banners: VendorBanner[]
  results: VendorResult[]
}

export interface VendorGetters {}

export interface VendorMutations {
  setBanners: (banners: VendorBanner[]) => void
  setResults: (results: VendorResult[]) => void
}

export interface VendorActions {}

export type VendorXStoreModule = XStoreModule<
  VendorState,
  VendorGetters,
  VendorMutations,
  VendorActions
>
