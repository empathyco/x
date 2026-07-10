import type { VendorResult, VendorResultPayload } from './store/types'

/**
 * Directory of events for the vendor module.
 *
 * @public
 */
export interface VendorXEvents {
  /**
   * The user has provided vendor results to be inserted in the result grid.
   * Payload: The array of vendor result inputs with their items and positions.
   */
  UserVendorResultsChanged: VendorResultPayload[]
  /**
   * The vendor results have been changed.
   * Payload: The new {@link VendorResult | vendor results}.
   */
  VendorResultsChanged: VendorResult[]
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
