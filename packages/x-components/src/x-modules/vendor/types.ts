import type { Banner, NamedModel, Result, Spannable } from '@empathyco/x-types'

/**
 * The interface for a vendor result, extending the base Result interface.
 */
export interface VendorResult extends Omit<Result, 'modelName'>, NamedModel<'VendorResult'> {
  position: number
}

/**
 * The interface for a vendor banner, extending the base Banner interface.
 */
export interface VendorBanner
  extends Omit<Banner, 'modelName'>, NamedModel<'VendorBanner'>, Spannable {
  position: number
}
