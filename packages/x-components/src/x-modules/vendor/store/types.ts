import type { NamedModel, Result } from '@empathyco/x-types'
import type { XStoreModule } from '../../../store'

export interface VendorResultPayload {
  item: Omit<Result, 'modelName'>
  position: number
}

export interface VendorResult extends Omit<Result, 'modelName'>, NamedModel<'VendorResult'> {
  position: number
}

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
