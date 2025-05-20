import type {
  Browse,
  BrowseRequest,
  BrowseResponse,
  Facet,
  Filter,
  Result,
  Sort,
  TaggingRequest,
} from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type {
  RequestStatus,
  StatusMutations,
  StatusState,
  XActionContext,
  XStoreModule,
} from '../../../store/index'
import type { UrlParams } from '../../../types/index'

export interface ReseteableBrowseState {
  selectedCategory: string
  results: Result[]
  facets: Facet[]
  page: number
  totalResults: number
  sort: Sort
  selectedFilters: Filter[]
  isNoResults: boolean
  browseTagging: TaggingRequest
  displayTagging: TaggingRequest
}

export interface BrowseState extends ReseteableBrowseState, StatusState {
  shouldAppendResults: boolean
  config: BrowseConfig
  params: Dictionary<unknown>
}

export interface BrowseConfig {
  pageSize: number
}

export interface BrowseGetters {
  browseRequest: BrowseRequest | null
}

export interface InternalBrowseResponse extends BrowseResponse {
  request: BrowseRequest
  status: RequestStatus
}

export interface BrowseMutations extends StatusMutations {
  updateResult: (result: Partial<Result> & Pick<Result, 'id'>) => void
  setBrowse: (browse: Browse) => void
  setSelectedCategory: (selectedCategory: string) => void
  setResults: (results: Result[]) => void
  setFacets: (facets: Facet[]) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotalResults: (totalResults: number) => void
  setSort: (sort: Sort) => void
  setSelectedFilters: (filters: Filter[]) => void
  setBrowseTagging: (browseTagging: TaggingRequest) => void
  setDisplayTagging: (displayTagging: TaggingRequest) => void
  setIsNoResults: (isNoResults: boolean) => void
  setShouldAppendResults: (shouldAppendResults: boolean) => void
  setParams: (params: Dictionary<unknown>) => void
  resetState: (_: any) => void
}

export interface BrowseActions {
  browse: (request: BrowseRequest | null) => BrowseResponse
  browseAndSave: (request: BrowseRequest | null) => void
  cancelBrowse: () => void
  increasePage: () => void
  setUrlParams: (urlParams: UrlParams) => void
}

export type BrowseActionContext = XActionContext<
  BrowseState,
  BrowseGetters,
  BrowseMutations,
  BrowseActions
>

export type BrowseXStoreModule = XStoreModule<
  BrowseState,
  BrowseGetters,
  BrowseMutations,
  BrowseActions
>
