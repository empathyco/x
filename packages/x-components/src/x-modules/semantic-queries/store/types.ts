import { SemanticQueriesRequest, SemanticQueriesResponse, SemanticQuery } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext } from '../../../store/actions.types';
import { XStoreModule } from '../../../store/store.types';
import { SemanticQueriesConfig } from '../config.types';
import { ConfigMutations } from '../../../store/utils/config-store.utils';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';

/**
 * SemanticQueries store state.
 *
 * @public
 */
export interface SemanticQueriesState extends QueryState {
  /** The number of the total results of the query. */
  totalResults: number;
  /** The request and results. */
  semanticQueries: SemanticQuery[];
  /** The configuration of the semantic queries' module. */
  config: SemanticQueriesConfig;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
}

/**
 * SemanticQueries store getters.
 *
 * @public
 */
export interface SemanticQueriesGetters {
  /**
   * The request to fetch the semantic queries.
   */
  request: SemanticQueriesRequest | null;

  /**
   * The normalized module's query.
   */
  normalizedQuery: string;
}

/**
 * SemanticQueries store mutations.
 *
 * @public
 */
export interface SemanticQueriesMutations
  extends QueryMutations,
    ConfigMutations<SemanticQueriesState> {
  /**
   * Sets the {@link SemanticQueriesState.query} property.
   */
  setQuery(query: string): void;
  /**
   * Sets the {@link SemanticQueriesState.totalResults} property.
   */
  setTotalResults(totalResults: number): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
  /**
   * Sets the {@link SemanticQueriesState.semanticQueries} property.
   */
  setSemanticQueries(semanticQueries: SemanticQuery[]): void;
}

/**
 * SemanticQueries store actions.
 *
 * @public
 */
export interface SemanticQueriesActions {
  /**.
   * Requests the results for a semantic query,
   *
   * @param request - The request object to retrieve the semantic queries.
   * @returns A semantic queries response based on the query.
   */
  fetchSemanticQuery(request: SemanticQueriesRequest | null): SemanticQueriesResponse | null;
  /**
   * Requests the semantic queries similar to the requested query and saves them in the state.
   *
   * @param request - The request object to retrieve the semantic queries.
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
