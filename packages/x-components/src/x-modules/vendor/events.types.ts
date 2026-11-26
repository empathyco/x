import type {
  VendorBanner,
  VendorRelatedPrompt,
  VendorRelatedPromptsGroupInput,
  VendorResult,
} from './types'

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
   * The x consumer has provided vendor related prompts groups to be inserted in the result grid.
   * Payload: The array of vendor related prompts groups with their prompts and rows.
   * modelName is excluded since it is an internal field, and we will assign it under the hood.
   */
  VendorRelatedPromptsChanged: VendorRelatedPromptsGroupInput[]
  /**
   * A vendor related prompt has been inserted in the DOM.
   * Payload: The {@link VendorRelatedPrompt | vendor related prompt} that was mounted.
   */
  VendorRelatedPromptMounted: VendorRelatedPrompt
  /**
   * The user viewed a vendor related prompt.
   * Payload: The {@link VendorRelatedPrompt | vendor related prompt} that was viewed.
   */
  UserViewedAVendorRelatedPrompt: VendorRelatedPrompt
  /**
   * The user clicked on a vendor related prompt.
   * Payload: The {@link VendorRelatedPrompt | vendor related prompt} that was clicked.
   */
  UserClickedAVendorRelatedPrompt: VendorRelatedPrompt

  /**
   * The vendor module query has changed.
   * Payload: The new vendor query string.
   *
   * @remarks This event is also emitted when the module is registered, with the current
   * query (which can be empty), to allow consumers to fetch the vendor results and banners
   * even when there is no query yet.
   */
  VendorQueryChanged: string
}
