import type { XStoreModule } from '../../../store'
import type { VendorResult, VendorResultTagging } from '../types'

export interface VendorState {
  results: VendorResult[]
}

export interface VendorGetters {}

export interface VendorMutations {
  setResults: (results: VendorResult[]) => void
}

export interface VendorActions {
  track: (payload: { result: VendorResult; trackingProperty: keyof VendorResultTagging }) => void
}

export type VendorXStoreModule = XStoreModule<
  VendorState,
  VendorGetters,
  VendorMutations,
  VendorActions
>
