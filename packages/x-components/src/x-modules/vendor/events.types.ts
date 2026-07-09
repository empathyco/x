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
}
