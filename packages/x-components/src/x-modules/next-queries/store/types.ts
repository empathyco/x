import { NextQueriesRequest } from '@empathyco/x-adapter';
import { HistoryQuery, NextQuery } from '@empathyco/x-types';
import { XActionContext, XStoreModule } from '../../../store';
import { StatusMutations, StatusState } from '../../../store/utils/status.helpers';
import { Dictionary } from '../../../utils';
import { NextQueriesConfig } from '../config.types';

/**
 * Next queries module state.
 *
 * @public
 */
export interface NextQueriesState extends StatusState {
  /** The internal query of the module. Used to request the next queries. */
  query: string;
  /** The list of the next queries, related to the `query` property of the state. */
  nextQueries: NextQuery[];
  /** The list of the searched queries, related to the `query` property of the state. */
  //TODO Changes to uses the base extended class Previewable or what we decide.
  searchedQueries: HistoryQuery[];
  /** Configuration options of the next queries module. */
  config: NextQueriesConfig;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
}

/**
 * Next queries module getters.
 *
 * @public
 */
export interface NextQueriesGetters {
  /** Request object to retrieve the next queries using the search adapter, or null if there is
   * not valid data to conform a valid request. */
  request: NextQueriesRequest | null;
  /** List of next queries that have not been searched before. */
  nextQueries: NextQuery[];
}

/**
 * Next queries module mutations.
 *
 * @public
 */
export interface NextQueriesMutations extends StatusMutations {
  /**
   * Sets the query of the module, which is used to retrieve the next-queries.
   *
   * @param newQuery - The new query to save to the state.
   */
  setQuery(newQuery: string): void;
  /**
   * Sets the next queries of the module.
   *
   * @param nextQueries - The new next queries to save to the state.
   */
  setNextQueries(nextQueries: NextQuery[]): void;
  /**
   * Sets the searched queries of the module.
   *
   * @param searchedQueries - The searched queries to save to the state.
   */
  setSearchedQueries(searchedQueries: HistoryQuery[]): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
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
  cancelFetchAndSaveNextQueries(): void;
  /**
   * Requests a new set of next queries for the module query, and returns them.
   *
   * @returns An array of next queries, or null if the request was not made.
   */
  fetchNextQueries(): NextQuery[] | null;
  /**
   * Requests a new set of next queries and stores them in the module.
   */
  fetchAndSaveNextQueries(): void;
  /**
   * Sets the query of the module based on the last history query.
   */
  setQueryFromLastHistoryQuery(historyQueries: HistoryQuery[]): void;
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
>;

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
>;
