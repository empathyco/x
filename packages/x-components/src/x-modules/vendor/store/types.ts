import type { RelatedTag } from '@empathyco/x-types'
import type { XStoreModule } from '../../../store'
import type { QueryMutations, QueryState } from '../../../store/utils/query.utils'
import type { UrlParams } from '../../../types'
import type { VendorBanner, VendorResult } from '../types'

export interface VendorState extends QueryState {
  banners: VendorBanner[]
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
