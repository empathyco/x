import { SemanticQueriesRequest, SemanticQueriesResponse, SemanticQuery } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext } from '../../../store/actions.types';
import { XStoreModule } from '../../../store/store.types';
import { RequestStatus } from '../../../store/utils/status-store.utils';
import { SemanticQueriesConfig } from '../config.types';

/**
 * SemanticQueries store state.
 *
 * @public
 */
export interface SemanticQueriesState {
  query: string;
  /* The request and results */
  semanticQueries: SemanticQuery[];
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
export interface SemanticQueriesGetters {
  request: SemanticQueriesRequest | null;
}

/**
 * QueriesPreview store mutations.
 *
 * @public
 */
export interface SemanticQueriesMutations {
  setQuery(query: string): void;
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

  setSemanticQueries(semanticQueries: SemanticQuery[]): void;
}

/**
 * QueriesPreview store actions.
 *
 * @public
 */
export interface SemanticQueriesActions {
  /**
   * Requests the results for a semantic query,
   *
   * @param request - The request object to retrieve the semantic query.
   * @returns A search response based on the query.
   */
  fetchSemanticQuery(request: SemanticQueriesRequest | null): SemanticQueriesResponse | null;
  /**
   * Requests the results for a semantic query and saves them in the state.
   *
   * @param request - The request object to retrieve the semantic query.
   */
  fetchAndSaveSemanticQuery(request: SemanticQueriesRequest | null): void;
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
