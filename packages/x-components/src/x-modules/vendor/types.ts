import type { NamedModel, Result } from '@empathyco/x-types'

export interface VendorResultTagging {
  view: string
  click: string
  add2cart: string
}

/**
 * The interface for a vendor result, extending the base Result interface.
 */
export interface VendorResult
  extends Omit<Result, 'modelName' | 'tagging'>, NamedModel<'VendorResult'> {
  position: number
  tagging?: VendorResultTagging
}
