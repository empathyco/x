import type { VendorResult } from './types'

/**
 * Directory of events for the vendor module.
 *
 * @public
 */
export interface VendorXEvents {
  /**
   * The x consumer has provided vendor results to be inserted in the result grid.
   * Payload: The array of vendor result inputs with their items and positions.
   * modelName is excluded since it is an internal field, and we will assign it under the hood.
   */
  VendorResultsChanged: Omit<VendorResult, 'modelName'>[]
  /**
   * The user viewed a vendor result.
   * Payload: The {@link VendorResult | vendor result} that was viewed.
   */
  UserViewedAVendorResult: VendorResult
  /**
   * The user clicked on a vendor result.
   * Payload: The {@link VendorResult | vendor result} that was clicked.
   */
  UserClickedAVendorResult: VendorResult
  /**
   * The user clicked on the add to cart button of a vendor result.
   * Payload: The {@link VendorResult | vendor result} that was clicked.
   */
  UserClickedVendorResultAddToCart: VendorResult
}
