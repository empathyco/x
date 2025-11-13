import type { Facet, FacetsRequest, FacetsResponse, Filter, RawFilter } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { StatusMutations, StatusState, XActionContext, XStoreModule } from '../../../store'
import type { ConfigMutations } from '../../../store/utils/config-store.utils'
import type { QueryMutations, QueryState } from '../../../store/utils/query.utils'
import type { QueryOrigin, QueryOriginInit } from '../../../types'

/**
 * Facets store state.
 *
 * @public
 */
export interface FacetsState extends StatusState, QueryState {
  /** The current facets config {@link FacetsState.config}. */
  config: FacetsConfig
  /** Record of all available filters indexed by its id. */
  filters: Record<Filter['id'], Filter>
  /** Record specifying the group each facet belongs to. */
  groups: Record<Facet['id'], GroupId>
  /** The facets without their filters. */
  facets: Record<Facet['id'], Omit<Facet, 'filters'>>
  /** Record of preselected filters indexed by its id. */
  preselectedFilters: RawFilter[]
  /** Record of sticky filters indexed by its id. */
  stickyFilters: Record<Filter['id'], Filter>
  /** The origin property of the request. */
  origin: QueryOrigin | null
  /** The extra params property of the state. */
  params: Dictionary<unknown>
}

/**
 * Facets store getters.
 *
 * @public
 */
export interface FacetsGetters {
  /**
   * List of all selected filters.
   */
  selectedFilters: Filter[]
  /**
   * List of all selected filters that conform to the filters for request strategy.
   */
  selectedFiltersForRequest: Filter[]
  /**
   * List of all selected filters grouped by their facet.
   */
  selectedFiltersByFacet: FiltersByFacet
  /**
   * List of all facets with their filters.
   */
  facets: Record<Facet['id'], Facet>
  /**
   * The adapter request object for retrieving the facets, or null if there is no
   * valid data to create a request.
   */
  request: FacetsRequest | null
}

/**
 * Facets store mutations.
 *
 * @public
 */
export interface FacetsMutations
  extends StatusMutations,
    QueryMutations,
    ConfigMutations<FacetsState> {
  /**
   * Updates the state of a filter.
   *
   * @param payload - An object containing the filter to update, and the properties to modify.
   */
  mutateFilter: (payload: MutateFilterPayload) => void
  /**
   * Removes the filter from the {@link FacetsState.filters | filters} record.
   *
   * @param filter - The filter to remove.
   */
  removeFilter: (filter: Filter) => void
  /**
   * Removes a list of filters from the {@link FacetsState.filters | filters} record.
   *
   * @param filters - The filters to remove.
   */
  removeFilters: (filters: Filter[]) => void
  /**
   * Sets the group id of the facet.
   *
   * @param facetGroupEntry - An object containing the new groupId and the facetId of the facet to
   * update.
   */
  setFacetGroup: (facetGroupEntry: FacetGroupEntry) => void
  /**
   * Adds a list of filters to the {@link FacetsState.filters | filters} record.
   *
   * @param filters - The filters to add.
   */
  setFilters: (filters: Filter[]) => void
  /**
   * Adds a list of filters to the {@link FacetsState.preselectedFilters | preselectedFilters}
   * record.
   *
   * @param filters - The filters to add.
   */
  setPreselectedFilters: (filters: RawFilter[]) => void
  /**
   * Removes the facet from the {@link FacetsState.facets | facets} record.
   *
   * @param facet - The facet to remove.
   */
  removeFacet: (facet: Facet) => void
  /**
   * Adds the facet to the {@link FacetsState.facets | facets} record.
   *
   * @param facet - The facet to set in the store.
   */
  setFacet: (facet: Facet) => void
  /**
   * Adds the filter to the {@link FacetsState.stickyFilters | sticky filters} record.
   *
   * @param filter - The filter to set in the store.
   */
  setStickyFilter: (filter: RawFilter) => void
  /**
   * Removes the filter from the {@link FacetsState.stickyFilters | sticky filters} record.
   *
   * @param filter - The filter to set in the store.
   */
  removeStickyFilter: (filter: RawFilter) => void
  /**
   * Removes all the filters from the {@link FacetsState.stickyFilters | sticky filters} record.
   *
   */
  clearStickyFilters: () => void
  /**
   * Sets the origin of the module.
   *
   * @param origin - The new origin.
   */
  setOrigin: (origin: QueryOrigin | undefined | null) => void
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams: (params: Dictionary<unknown>) => void
}

/**
 * Facets store actions.
 *
 * @public
 */
export interface FacetsActions {
  /**
   * Cancels / interrupt {@link FacetsActions.cancelFetchAndSaveFacetsResponse} synchronous promise.
   */
  cancelFetchAndSaveFacetsResponse: () => void
  /**
   * Fetches a new facets response and stores them in the module state.
   */
  fetchAndSaveFacetsResponse: (request: FacetsRequest | null) => void
  /**
   * Fetches the facets response and returns them.
   *
   * @returns The new search response.
   */
  fetchFacetsResponse: (request: FacetsRequest) => FacetsResponse
  /**
   * Creates a {@link QueryOrigin} and saves it.
   *
   * @param originInit - The object to create the origin with.
   */
  saveOrigin: (originInit: QueryOriginInit) => void
}

/**
 * The type of the context object for the facets module actions.
 *
 * @public
 */
export type FacetsActionsContext = XActionContext<
  FacetsState,
  FacetsGetters,
  FacetsMutations,
  FacetsActions
>

/**
 * Facets type safe store module.
 *
 * @public
 */
export type FacetsXStoreModule = XStoreModule<
  FacetsState,
  FacetsGetters,
  FacetsMutations,
  FacetsActions
>

/**
 * Alias for GroupId.
 *
 * @public
 */
export type GroupId = string

/**
 * An object containing a facet id and the group id it belongs to.
 *
 * @public
 */
export interface FacetGroupEntry {
  /** The facet id. */
  facetId: Facet['id']
  /** The group id. */
  groupId: GroupId
}

/**
 * Dictionary grouping filters by facet id.
 *
 * @public
 */
export type FiltersByFacet = Record<Facet['id'], Filter[]>

/**
 * Payload to use in the `mutateFilter` mutation.
 *
 * @public
 */
export interface MutateFilterPayload {
  /**
   * The filter to modify.
   * If it does not belong to the store it will be added.
   */
  filter: Filter
  /**
   * The new fields values to modify in the filter.
   */
  newFilterState: Partial<Filter>
}

/**
 * Configuration options for the {@link FacetsXModule}.
 *
 * @public
 */
export interface FacetsConfig {
  /** The filter strategy to use when providing the selected filters for requests. */
  filtersStrategyForRequest: filtersStrategyForRequest
}

/**
 * Type for the filter strategy to use when providing the selected filters.
 *
 * @public
 */
export type filtersStrategyForRequest = 'all' | 'leaves-only'
