import type { XStoreModule } from '../../../store'
import type { VendorResult } from '../types'

export interface VendorState {
  results: VendorResult[]
}

export interface VendorGetters {}

export interface VendorMutations {
  setResults: (results: VendorResult[]) => void
}

export interface VendorActions {}

export type VendorXStoreModule = XStoreModule<
  VendorState,
  VendorGetters,
  VendorMutations,
  VendorActions
>
