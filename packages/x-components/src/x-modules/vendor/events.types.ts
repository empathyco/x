import type { VendorBanner, VendorResult } from './types'

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
   * The x consumer has provided vendor banners to be inserted in the result grid.
   * Payload: The array of vendor banner inputs with their items and positions.
   * modelName is excluded since it is an internal field, and we will assign it under the hood.
   */
  VendorBannersChanged: Omit<VendorBanner, 'modelName'>[]
}
