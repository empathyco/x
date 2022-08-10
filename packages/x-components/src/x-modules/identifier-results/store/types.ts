import { IdentifierResultsRequest, Result } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext, XStoreModule } from '../../../store';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { StatusMutations, StatusState } from '../../../store/utils/status-store.utils';
import { QueryOrigin, QueryOriginInit } from '../../../types/origin';
import { IdentifierResultsConfig } from '../config.types';

/**
 * IdentifierResults store state.
 *
 * @public
 */
export interface IdentifierResultsState extends StatusState, QueryState {
  /** The configuration of the identifier results module. */
  config: IdentifierResultsConfig;
  /** The list of the identifier results, related to the `query` property of the state. */
  identifierResults: Result[];
  /** The origin property of the request. */
  origin: QueryOrigin | null;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
  /** The internal query of the module. Used to request the identifier results. */
  query: string;
}

/**
 * IdentifierResults store getters.
 *
 * @public
 */
export interface IdentifierResultsGetters {
  /**
   * The adapter request object for retrieving the identifier suggestions, or null if there is not
   * valid data to create a request.
   */
  identifierResultsRequest: IdentifierResultsRequest | null;
  /** The RegExp to test against the query. */
  identifierDetectionRegexp: RegExp;
  /**
   * The RegExp with the current query from the state adding the separatorChars after each
   * matching character.
   */
  identifierHighlightRegexp: RegExp;
}

/**
 * IdentifierResults store mutations.
 *
 * @public
 */
export interface IdentifierResultsMutations extends StatusMutations, QueryMutations {
  /**
   * Sets the identifier results of the module.
   *
   * @param identifierResults - The new identifier results to save to the state.
   */
  setIdentifierResults(identifierResults: Result[]): void;
  /**
   * Sets the origin of the module.
   *
   * @param origin - The new origin.
   *
   */
  setOrigin(origin: QueryOrigin | undefined | null): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
  /**
   * Sets the query of the module, which is used to retrieve the identifier-results.
   *
   * @param newQuery - The new query to save to the state.
   */
  setQuery(newQuery: string): void;
}

/**
 * IdentifierResults store actions.
 *
 * @public
 */
export interface IdentifierResultsActions {
  /**
   * Cancels / interrupt {@link IdentifierResultsActions.fetchAndSaveIdentifierResults} synchronous
   * promise.
   */
  cancelFetchAndSaveIdentifierResults(): void;
  /**
   * Requests a new set of identifier results for the module query, and returns them.
   *
   * @returns An array of identifier results.
   */
  fetchIdentifierResults(request: IdentifierResultsRequest | null): Result[];
  /**
   * Requests a new set of identifier results and stores them in the module.
   */
  fetchAndSaveIdentifierResults(request: IdentifierResultsRequest | null): void;
  /**
   * Creates a {@link QueryOrigin} and saves it.
   *
   * @param originInit - The object to create the origin with.
   */
  saveOrigin(originInit: QueryOriginInit): void;
  /**
   * Stores the query in the module if it matches the regex.
   */
  saveQuery(query: string): void;
}

/**
 * IdentifierResults type safe store module.
 *
 * @public
 */
export type IdentifierResultsXStoreModule = XStoreModule<
  IdentifierResultsState,
  IdentifierResultsGetters,
  IdentifierResultsMutations,
  IdentifierResultsActions
>;

/**
 * Alias type for actions context of the {@link IdentifierResultsXStoreModule}.
 *
 * @public
 */
export type IdentifierResultsActionsContext = XActionContext<
  IdentifierResultsState,
  IdentifierResultsGetters,
  IdentifierResultsMutations,
  IdentifierResultsActions
>;
