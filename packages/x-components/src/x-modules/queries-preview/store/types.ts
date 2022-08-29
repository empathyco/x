import { Result, SearchRequest, SearchResponse } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext } from '../../../store/actions.types';
import { XStoreModule } from '../../../store/store.types';
import { RequestStatus, StatusState } from '../../../store/utils/status-store.utils';
import { QueriesPreviewConfig } from '../config.types';

/**
 * QueriesPreview store state.
 *
 * @public
 */
export interface QueryPreviewItem extends StatusState {
  /**
   * Request object to retrieve the query preview using the search adapter, or null if there is
   * no valid data to conform a valid request.
   */
  request: SearchRequest;
  /** Results of the query preview request. */
  results: Result[];
  /** The total number of results for the search query. */
  totalResults: number;
}

/**
 * QueriesPreview store state.
 *
 * @public
 */
export interface QueriesPreviewState {
  /* The request and results */
  queriesPreview: Dictionary<QueryPreviewItem>;
  /** The configuration of the queries preview module. */
  config: QueriesPreviewConfig;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
}

/**
 * QueriesPreview store getters.
 *
 * @public
 */
export interface QueriesPreviewGetters {}

/**
 * QueriesPreview store mutations.
 *
 * @public
 */
export interface QueriesPreviewMutations {
  /**
   * Removes a query preview entry from the queries preview's dictionary.
   *
   * @param query - Query whose entry will be removed.
   */
  clearQueryPreview(query: string): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
  /**
   * Adds a new entry to the queries preview's dictionary.
   *
   * @param queryPreview - The query preview item to add.
   */
  setQueryPreview(queryPreview: QueryPreviewItem): void;
  /**
   * Sets the status of a query preview request.
   *
   * @param payload - Object containing the query and the status of a query preview item.
   */
  setStatus(payload: QueryPreviewStatusPayload): void;
}

/**
 * QueriesPreview store actions.
 *
 * @public
 */
export interface QueriesPreviewActions {
  /**
   * Requests the results for a query preview,
   * limited by {@link QueriesPreviewConfig.maxItemsToRequest}.
   *
   * @param request - The request object to retrieve the query preview.
   * @returns A search response based on the query.
   */
  fetchQueryPreview(request: SearchRequest): SearchResponse | null;
  /**
   * Requests the results for a query preview and saves them in the state.
   *
   * @param request - The request object to retrieve the query preview.
   */
  fetchAndSaveQueryPreview(request: SearchRequest): void;
}

/**
 * QueriesPreview type safe store module.
 *
 * @public
 */
export type QueriesPreviewXStoreModule = XStoreModule<
  QueriesPreviewState,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewActions
>;

/**
 * Alias type for actions context of the {@link QueriesPreviewXStoreModule}.
 *
 * @public
 */
export type QueriesPreviewActionContext = XActionContext<
  QueriesPreviewState,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewActions
>;

/**
 * Payload to use in the `setStatus` mutation.
 *
 * @public
 */
export interface QueryPreviewStatusPayload {
  /**
   * The query whose request status to modify.
   */
  query: string;
  /**
   * The new request status.
   */
  status: RequestStatus;
}
