import { NextQueriesRequest } from '@empathy/search-adapter';
import { HistoryQuery, NextQuery } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { NextQueriesConfig } from '../config.types';

/**
 * Next queries module state.
 *
 * @public
 */
export interface NextQueriesState {
  /** The internal query of the module. Used to request the next queries. */
  query: string;
  /** The list of the next queries, related to the `query` property of the state. */
  nextQueries: NextQuery[];
  /** Configuration options of the next queries module. */
  config: NextQueriesConfig;
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
}

/**
 * Next queries module mutations.
 *
 * @public
 */
export interface NextQueriesMutations {
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
}

/**
 * Next queries module actions.
 *
 * @public
 */
export interface NextQueriesActions {
  /**
   * Requests a new set of next queries for the module query, and returns them .
   *
   * @returns An array of next queries.
   */
  getNextQueries(): NextQuery[];
  /**
   * Requests a new set of next queries and stores them in the module.
   */
  getAndSaveNextQueries(): void;
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
