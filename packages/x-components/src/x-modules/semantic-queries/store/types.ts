import { Result, SearchRequest, SearchResponse } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext } from '../../../store/actions.types';
import { XStoreModule } from '../../../store/store.types';
import { RequestStatus, StatusState } from '../../../store/utils/status-store.utils';
import { SemanticQueriesConfig } from '../config.types';

/**
 * SemanticQueries store state.
 *
 * @public
 */
export interface SemanticQueryItem extends StatusState {
  /**
   * Request object to retrieve the semantic query using the search adapter, or null if there is
   * no valid data to conform a valid request.
   */
  request: SearchRequest;
  /** Results of the semantic query request. */
  results: Result[];
  /** The total number of results for the search query. */
  totalResults: number;
}

/**
 * SemanticQueries store state.
 *
 * @public
 */
export interface SemanticQueriesState {
  /* The request and results */
  semanticQueries: Dictionary<SemanticQueryItem>;
  /** The configuration of the queries preview module. */
  config: SemanticQueriesConfig;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
}

/**
 * QueriesPreview store getters.
 *
 * @public
 */
export interface SemanticQueriesGetters {}

/**
 * QueriesPreview store mutations.
 *
 * @public
 */
export interface SemanticQueriesMutations {
  /**
   * Removes a query preview entry from the queries preview's dictionary.
   *
   * @param query - Query whose entry will be removed.
   */
  clearSemanticQuery(query: string): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
  /**
   * Adds a new entry to the queries preview's dictionary.
   *
   * @param semanticQuery - The query preview item to add.
   */
  setSemanticQuery(semanticQuery: SemanticQueryItem): void;
  /**
   * Sets the status of a query preview request.
   *
   * @param payload - Object containing the query and the status of a query preview item.
   */
  setStatus(payload: SemanticQueryStatusPayload): void;
}

/**
 * QueriesPreview store actions.
 *
 * @public
 */
export interface SemanticQueriesActions {
  /**
   * Requests the results for a semantic query,
   * limited by {@link SemanticQueriesConfig.maxItemsToRequest}.
   *
   * @param request - The request object to retrieve the semantic query.
   * @returns A search response based on the query.
   */
  fetchSemanticQuery(request: SearchRequest): SearchResponse | null;
  /**
   * Requests the results for a semantic query and saves them in the state.
   *
   * @param request - The request object to retrieve the semantic query.
   */
  fetchAndSaveSemanticQuery(request: SearchRequest): void;
}

/**
 * SemanticQueries type safe store module.
 *
 * @public
 */
export type SemanticQueriesXStoreModule = XStoreModule<
  SemanticQueriesState,
  SemanticQueriesGetters,
  SemanticQueriesMutations,
  SemanticQueriesActions
>;

/**
 * Alias type for actions context of the {@link SemanticQueriesXStoreModule}.
 *
 * @public
 */
export type SemanticQueriesActionContext = XActionContext<
  SemanticQueriesState,
  SemanticQueriesGetters,
  SemanticQueriesMutations,
  SemanticQueriesActions
>;

/**
 * Payload to use in the `setStatus` mutation.
 *
 * @public
 */
export interface SemanticQueryStatusPayload {
  /**
   * The query whose request status to modify.
   */
  query: string;
  /**
   * The new request status.
   */
  status: RequestStatus;
}
