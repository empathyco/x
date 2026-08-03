import type { RelatedTag } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { XStoreModule } from '../../../store'
import type { QueryMutations, QueryState } from '../../../store/utils/query.utils'
import type { UrlParams } from '../../../types'
import type { VendorBanner, VendorResult } from '../types'

/**
 * The vendor results and banners of a query preview, indexed by its query preview hash.
 *
 * @public
 */
export interface VendorQueryPreview {
  /** The vendor results of the query preview. */
  results: VendorResult[]
  /** The vendor banners of the query preview. */
  banners: VendorBanner[]
}

export interface VendorState extends QueryState {
  banners: VendorBanner[]
  /** The vendor results and banners of the query previews, indexed by their query preview hash. */
  queryPreviews: Dictionary<VendorQueryPreview>
  relatedTags: RelatedTag[]
  results: VendorResult[]
}

export interface VendorGetters {
  query: string
}

export interface VendorMutations extends QueryMutations {
  setBanners: (banners: VendorBanner[]) => void
  setRelatedTags: (relatedTags: RelatedTag[]) => void
  setResults: (results: VendorResult[]) => void
  /**
   * Sets the vendor results of a query preview.
   *
   * @param payload - Object containing the query preview hash and the vendor results.
   * @param payload.queryPreviewHash - The hash of the query preview to save the results to.
   * @param payload.results - The vendor results to save.
   */
  setQueryPreviewVendorResults: (payload: {
    queryPreviewHash: string
    results: Omit<VendorResult, 'modelName'>[]
  }) => void
  /**
   * Sets the vendor banners of a query preview.
   *
   * @param payload - Object containing the query preview hash and the vendor banners.
   * @param payload.queryPreviewHash - The hash of the query preview to save the banners to.
   * @param payload.banners - The vendor banners to save.
   */
  setQueryPreviewVendorBanners: (payload: {
    queryPreviewHash: string
    banners: Omit<VendorBanner, 'modelName'>[]
  }) => void
  /**
   * Removes the vendor results and banners of a query preview.
   *
   * @param queryPreviewHash - The hash of the query preview to remove its vendor data.
   */
  removeQueryPreviewVendorData: (queryPreviewHash: string) => void
  resetState: () => void
}

export interface VendorActions {
  setUrlParams: (urlParams: UrlParams) => void
}

export type VendorXStoreModule = XStoreModule<
  VendorState,
  VendorGetters,
  VendorMutations,
  VendorActions
>
