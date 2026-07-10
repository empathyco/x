import type { NamedModel, Result } from '@empathyco/x-types'
import type { XStoreModule } from '../../../store'

export interface VendorResultTagging {
  view: string
  click: string
  add2cart: string
}

export interface VendorResultPayload {
  item: Omit<Result, 'modelName'>
  position: number
  tagging?: VendorResultTagging
}

export interface VendorResult extends Omit<Result, 'modelName'| 'tagging'>, NamedModel<'VendorResult'> {
  position: number
  tagging?: VendorResultTagging
}

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
