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
   * A vendor result has been inserted in the DOM.
   * Payload: The {@link VendorResult | vendor result} that was mounted.
   */
  VendorResultMounted: VendorResult
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

  /**
   * The x consumer has provided vendor banners to be inserted in the result grid.
   * Payload: The array of vendor banner inputs with their items and positions.
   * modelName is excluded since it is an internal field, and we will assign it under the hood.
   */
  VendorBannersChanged: Omit<VendorBanner, 'modelName'>[]

  /**
   * The x consumer has provided vendor results to be inserted in the result grid of a query
   * preview.
   * Payload: The query preview hash and the vendor results to be inserted, without the
   * `modelName` field, since it is assigned under the hood.
   */
  QueryPreviewVendorResultsChanged: {
    queryPreviewHash: string
    results: Omit<VendorResult, 'modelName'>[]
  }

  /**
   * The x consumer has provided vendor banners to be inserted in the result grid of a query
   * preview.
   * Payload: The query preview hash and the vendor banners to be inserted, without the
   * `modelName` field, since it is assigned under the hood.
   */
  QueryPreviewVendorBannersChanged: {
    queryPreviewHash: string
    banners: Omit<VendorBanner, 'modelName'>[]
  }

  /**
   * A vendor banner has been inserted in the DOM.
   * Payload: The {@link VendorBanner | vendor banner} that was mounted.
   */
  VendorBannerMounted: VendorBanner
  /**
   * The user viewed a vendor banner.
   * Payload: The {@link VendorBanner | vendor banner} that was viewed.
   */
  UserViewedAVendorBanner: VendorBanner
  /**
   * The user clicked on a vendor banner.
   * Payload: The {@link VendorBanner | vendor banner} that was clicked.
   */
  UserClickedAVendorBanner: VendorBanner

  /**
   * The vendor module query has changed.
   * Payload: The new vendor query string.
   */
  VendorQueryChanged: string
}
