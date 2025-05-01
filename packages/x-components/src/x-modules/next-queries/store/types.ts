import type {
  HistoryQuery,
  NextQueriesRequest,
  NextQuery,
  PreviewResults,
  RelatedTag,
  SearchResponse,
} from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { XActionContext, XStoreModule } from '../../../store'
import type { ConfigMutations } from '../../../store/utils/config-store.utils'
import type { QueryMutations, QueryState } from '../../../store/utils/query.utils'
import type { StatusMutations, StatusState } from '../../../store/utils/status-store.utils'
import type { FeatureLocation } from '../../../types/index'
import type { UrlParams } from '../../../types/url-params'
import type { NextQueriesConfig } from '../config.types'

/**
 * Next queries module state.
 *
 * @public
 */
export interface NextQueriesState extends StatusState, QueryState {
  /** The list of the next queries, related to the `query` property of the state. */
  nextQueries: NextQuery[]
  /** The list of the searched queries, related to the `query` property of the state. */
  //TODO Changes to uses the base extended class Previewable or what we decide.
  searchedQueries: HistoryQuery[]
  /** The list of the related tags, related to the `query` property of the state. */
  relatedTags: RelatedTag[]
  /** Configuration options of the next queries module. */
  config: NextQueriesConfig
  /** The extra params property of the state. */
  params: Dictionary<unknown>
  /** Results of the next queries requests. */
  resultsPreview: Dictionary<PreviewResults>
}

/**
 * Next queries module getters.
 *
 * @public
 */
export interface NextQueriesGetters {
  /**
   * Request object to retrieve the next queries using the search adapter, or null if there is
   * no valid data to conform a valid request.
   */
  request: NextQueriesRequest | null
  /** List of next queries that have not been searched before. */
  nextQueries: NextQuery[]
  /** The combination of the query and the selected related tags. */
  query: string
}

/**
 * Next queries module mutations.
 *
 * @public
 */
export interface NextQueriesMutations
  extends StatusMutations,
    QueryMutations,
    ConfigMutations<NextQueriesState> {
  /**
   * Sets the next queries of the module.
   *
   * @param nextQueries - The new next queries to save to the state.
   */
  setNextQueries: (nextQueries: NextQuery[]) => void
  /**
   * Sets the searched queries of the module.
   *
   * @param searchedQueries - The searched queries to save to the state.
   */
  setSearchedQueries: (searchedQueries: HistoryQuery[]) => void
  /**
   * Sets the related tags of the module.
   *
   * @param relatedTags - The new related tags to save to the state.
   */
  setRelatedTags: (relatedTags: RelatedTag[]) => void
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams: (params: Dictionary<unknown>) => void
  /**
   * Adds a new entry to the result's dictionary.
   *
   * @param resultsPreview - Object containing the next query,
   * the totalResults and the results to add.
   */
  setResultsPreview: (resultsPreview: Dictionary<PreviewResults>) => void
  /**
   * Resets the result's dictionary.
   */
  resetResultsPreview: () => void
}

/**
 * Next queries module actions.
 *
 * @public
 */
export interface NextQueriesActions {
  /**
   * Cancels / interrupt {@link NextQueriesActions.fetchAndSaveNextQueries} synchronous promise.
   */
  cancelFetchAndSaveNextQueries: () => void
  /**
   * Requests a new set of next queries for the module query, and returns them.
   *
   * @returns An array of next queries, or null if the request was not made.
   */
  fetchNextQueries: (request: NextQueriesRequest | null) => NextQuery[] | null
  /**
   * Requests a new set of next queries and stores them in the module.
   */
  fetchAndSaveNextQueries: (request: NextQueriesRequest | null) => void
  /**
   * Sets the query of the module based on the last history query.
   */
  setQueryFromLastHistoryQuery: (historyQueries: HistoryQuery[]) => void
  /**
   * Checks if the url has a query on it and then updates the state with that value.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams: (urlParams: UrlParams) => void
  /**
   * Requests the results to preview a next query,
   * limited by {@link NextQueriesConfig.maxPreviewItemsToRequest}.
   *
   * @returns A search response based on the next query.
   * @param payload - The payload object containing the query and its location.
   */
  fetchNextQueryPreview: (payload: {
    query: string
    location: FeatureLocation | undefined
  }) => SearchResponse | null
  /**
   * Requests the results to preview a next query and saves them in the state.
   *
   * @param payload - The payload object containing the query and its location.
   */
  fetchAndSaveNextQueryPreview: (payload: {
    query: string
    location: FeatureLocation | undefined
  }) => void
}

/**
 * Next queries store module.
 *
 * @public
 */
export type NextQueriesXStoreModule = XStoreModule<
  NextQueriesState,
  NextQueriesGetters,
  NextQueriesMutations,
  NextQueriesActions
>

/**
 * Alias type for actions context of the {@link NextQueriesXStoreModule}.
 *
 * @public
 */
export type NextQueriesActionContext = XActionContext<
  NextQueriesState,
  NextQueriesGetters,
  NextQueriesMutations,
  NextQueriesActions
>
