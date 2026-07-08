import type { VendorResult } from '@empathyco/x-types'
import type { StatusMutations, StatusState, XStoreModule  } from '../../../store'

export interface VendorState extends StatusState {
  vendorResults: VendorResult[]
}

export interface VendorGetters {}

export interface VendorMutations extends StatusMutations {
  setVendorResults: (vendorResults: VendorResult[]) => void
}

export interface VendorActions {}

export type VendorXStoreModule = XStoreModule<
  VendorState,
  VendorGetters,
  VendorMutations,
  VendorActions
>
