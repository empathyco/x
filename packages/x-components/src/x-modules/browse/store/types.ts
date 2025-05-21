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

/**
 * Browse store reseteable state.
 *
 * @public
 */
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

/**
 * Browse store state.
 *
 * @public
 */
export interface BrowseState extends ReseteableBrowseState, StatusState {
  shouldAppendResults: boolean
  config: BrowseConfig
  params: Dictionary<unknown>
}

/**
 * The configuration of the browse module.
 *
 * @public
 */
export interface BrowseConfig {
  pageSize: number
}

/**
 * Browse store getters.
 *
 * @public
 */
export interface BrowseGetters {
  browseRequest: BrowseRequest | null
}

/**
 * An internal browse response containing the {@link BrowseRequest} performed to get a
 * {@link @empathyco/x-types#BrowseResponse} and its {@link RequestStatus}.
 *
 * @public
 */
export interface InternalBrowseResponse extends BrowseResponse {
  request: BrowseRequest
  status: RequestStatus
}

/**
 * Browse store mutations.
 *
 * @public
 */
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

/**
 * Browse store actions.
 *
 * @public
 */
export interface BrowseActions {
  browse: (request: BrowseRequest | null) => BrowseResponse
  browseAndSave: (request: BrowseRequest | null) => void
  cancelBrowse: () => void
  increasePage: () => void
  setUrlParams: (urlParams: UrlParams) => void
}

/**
 * Alias type for actions context of the {@link BrowseXStoreModule}.
 *
 * @public
 */
export type BrowseActionContext = XActionContext<
  BrowseState,
  BrowseGetters,
  BrowseMutations,
  BrowseActions
>

/**
 * Browse type safe store module.
 *
 * @public
 */
export type BrowseXStoreModule = XStoreModule<
  BrowseState,
  BrowseGetters,
  BrowseMutations,
  BrowseActions
>
