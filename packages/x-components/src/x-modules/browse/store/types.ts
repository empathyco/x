import type {
  Banner,
  BrowsableRequest,
  BrowseRequest,
  BrowseResponse,
  Facet,
  Filter,
  Promoted,
  Result,
  Sort,
  Stats,
  TaggingRequest,
} from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { StatusMutations, StatusState, XActionContext, XStoreModule } from '../../../store'
import type { ConfigMutations } from '../../../store/utils/config-store.utils'
import type { QueryOrigin, QueryOriginInit, UrlParams } from '../../../types'
import type { BrowseConfig } from '../config.types'
import type { InternalBrowseRequest, WatchedInternalBrowseRequest } from '../types'

/**
 * Browse store state.
 *
 * @public
 */
export interface BrowseState extends StatusState {
  /** The list of the banners, related to the `browseCategory` property of the state. */
  banners: Banner[]
  /** The configuration of the browse module. */
  config: BrowseConfig
  /** The list of the facets, related to the `query` property of the state. */
  facets: Facet[]
  /** A flag to indicate if new results are append to the current instead of replacing them. */
  isAppendResults: boolean
  /** Flag indicating if there is a no results situation. */
  isNoResults: boolean
  /** Flag indicating if there is a no results situation with filters selected. */
  fromNoResultsWithFilters: boolean
  /** The origin property of the request. */
  origin: QueryOrigin | null
  /** The current page of the request. */
  page: number
  /** The extra params property of the state. */
  params: Dictionary<unknown>
  /** The list of the promoted, related to the `query` property of the state. */
  promoteds: Promoted[]
  /** The browse tagging used to track the browse events. */
  browseTagging: TaggingRequest
  /** The display tagging used to track the browse events. */
  displayBrowseTagging: TaggingRequest
  /** The list of the results, related to the `query` property of the state. */
  results: Result[]
  /**
   * The dictionary of selected filters, used to perform the browse request.
   * The key is the facet id, and the value the list of filters for that facet.
   */
  selectedFilters: Dictionary<Filter[]>
  /** The way of ordering the results. */
  sort: Sort
  /** The stats of the results. */
  stats: Stats
  /** The total number of results, related to the `query` property of the state. */
  totalResults: number
  /** The current selected category of the request  */
  selectedCategory: BrowsableRequest
}

/**
 * Browse store getters.
 *
 * @public
 */
export interface BrowseGetters {
  /**
   * The adapter request object for retrieving the results, or null if there is no
   * valid data to create a request.
   */
  request: InternalBrowseRequest | null
}

/**
 * Browse store mutations.
 *
 * @public
 */
export interface BrowseMutations extends StatusMutations, ConfigMutations<BrowseState> {
  /**
   * Append the results to the results state.
   *
   * @param results - Results array.
   */
  appendResults: (results: Result[]) => void
  /**
   * Resets the "resettable" part of the Browse state to the initial state. See the
   * {@link BrowseXStoreModule} for details.
   */
  resetState: () => void
  /**
   * Resets the "resettable" part of the Browse state like {@link BrowseMutations.resetState} but
   * maintains the values required to perform the browse request again.
   */
  resetStateForReload: () => void
  /**
   * Sets the banners of the module.
   *
   * @param banners - The new banners to save to the state.
   */
  setBanners: (banners: Banner[]) => void
  /**
   * Sets the facets of the module.
   *
   * @param facets - The new facets to save to the state.
   */
  setFacets: (facets: Facet[]) => void
  /**
   * Set the `isAppendResuls` flag value.
   *
   * @param isAppendResults - The new flag value.
   */
  setIsAppendResults: (isAppendResults: boolean) => void
  /**
   * Sets the `isNoResults` flag value.
   *
   * @param isNoResults - The new flag value.
   */
  setIsNoResults: (isNoResults: boolean) => void
  /**
   * Sets the `fromNoResultsWithFilters` flag value.
   *
   * @param fromNoResultsWithFilters - The new flag value.
   */
  setFromNoResultsWithFilters: (fromNoResultsWithFilters: boolean) => void
  /**
   * Sets the origin of the module.
   *
   * @param origin - The new origin.
   */
  setOrigin: (origin: QueryOrigin | undefined | null) => void
  /**
   * Sets the page of the module.
   *
   * @param page - The new page.
   */
  setPage: (page: number) => void
  /** Sets the selected category of the module.
   *
   * @param selectedCategory - The new selectedCategory.
   */
  setSelectedCategory: (selectedCategory: BrowsableRequest) => void
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams: (params: Dictionary<unknown>) => void
  /**
   * Sets the promoteds of the module.
   *
   * @param promoteds - The new promoted to save to the state.
   */
  setPromoteds: (promoteds: Promoted[]) => void
  /**
   * Sets the browse tagging of the module, which is used to track the query.
   *
   * @param browseTagging - The new query tagging object to save to the state.
   */
  setBrowseTagging: (browseTagging: TaggingRequest) => void
  /**
   * Sets the display tagging of the module.
   *
   * @param displayBrowseTagging - The new display tagging object to save to the state.
   */
  setDisplayBrowseTagging: (displayBrowseTagging: TaggingRequest) => void
  /**
   * Sets the results of the module.
   *
   * @param results - The new results to save to the state.
   */
  setResults: (results: Result[]) => void
  /**
   * Sets the selected filters of the module.
   *
   * @param selectedFilters - The new selected filters to save to the state.
   */
  setSelectedFilters: (selectedFilters: Filter[]) => void
  /**
   * Sets the selected sort option of the module.
   *
   * @param sort - The new sort.
   */
  setSort: (sort: Sort) => void
  /**
   * Sets the stats of the module.
   *
   * @param stats - The new stats to save to the state.
   */
  setStats: (stats: Stats) => void
  /**
   * Sets the total results of the module.
   *
   * @param totalResults - The new total results to save to the state.
   */
  setTotalResults: (totalResults: number) => void
  /**
   * Updates a result with new fields.
   *
   * @param result - A result containing at least an id, and the properties to modify.
   */
  updateResult: (result: Partial<Result> & Pick<Result, 'id'>) => void
  /**
   * Updates the results with the enrichment results.
   *
   * @param enrichmentResults - The enrichment results.
   */
  updateResultsFromEnrichment: (enrichmentResults: any[]) => void
}

/**
 * Browse store actions.
 *
 * @public
 */
export interface BrowseActions {
  /**
   * Batches state resets in a single action after {@link BrowseGetters.request} parameters update.
   *
   * @param watchedRequest - The watched internal browse request object.
   */
  resetRequestOnRefinement: (watchedRequest: WatchedInternalBrowseRequest) => void
  /**
   * Cancels / interrupt {@link BrowseActions.fetchAndSaveBrowseResponse} synchronous promise.
   */
  cancelFetchAndSaveBrowseResponse: () => void
  /**
   * Fetches a new browse response and stores them in the module state.
   */
  fetchAndSaveBrowseResponse: (request: InternalBrowseRequest | null) => void
  /**
   * Fetches the browse response and returns them.
   *
   * @returns The new browse response.
   */
  fetchBrowseResponse: (request: BrowseRequest) => BrowseResponse
  /**
   * Requests and stores the enrichment results for the results.
   *
   * @param results - The results.
   */
  fetchAndSaveResultsEnrichment: (results: Result[]) => void
  /**
   * Checks if there are more pages of results to load. If there are, then increases the page
   * number in state and set to `true` the {@link BrowseState.isAppendResults} flag.
   *
   * @remarks This action is to implement the infinite scroll behaviour. To increase the page
   * for other purposes, please use the {@link BrowseMutations.setPage} mutation.
   */
  increasePageAppendingResults: () => void
  /**
   * Checks if the url has params on it and then updates the state with these values.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams: (urlParams: UrlParams) => void
  /**
   * Creates a {@link QueryOrigin} and saves it.
   *
   * @param originInit - The object to create the origin with.
   */
  saveOrigin: (originInit: QueryOriginInit) => void
  /**
   * Saves the {@link @empathyco/x-types#BrowseResponse}.
   *
   * @param response - The {@link @empathyco/x-types#BrowseResponse} to save.
   */
  saveBrowseResponse: (response: BrowseResponse) => void
}

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
