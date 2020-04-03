import { HistoryQuery } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { HistoryQueriesConfig } from '../config.types';

/**
 * HistoryQueries store state.
 *
 * @public
 */
export interface HistoryQueriesState {
  /**
   * Configuration for the `HistoryQueries` module.
   */
  config: HistoryQueriesConfig;
  /**
   * Timestamp that indicates when the current search session has started.
   */
  sessionTimeStampInMs: number;
  /**
   * The full list of queries made by the user. This list is persisted along different
   * search sessions.
   */
  historyQueries: HistoryQuery[];
  /**
   * The current query for searching into the {@link HistoryQueriesState.historyQueries}.
   */
  query: string;
}

/**
 * HistoryQueries store getters.
 *
 * @public
 */
export interface HistoryQueriesGetters {
  /**
   * A sub-set of the {@link HistoryQueriesState.historyQueries} with a maximum length set in
   * {@link HistoryQueriesConfig.maxItemsToRender}. If the {@link HistoryQueriesState.query}
   * property is not empty, this list will only contain suggestions whose query matches with it.
   */
  historyQueries: HistoryQuery[];
  /**
   * A list of the queries that have been made in the last period of time specified by
   * {@link HistoryQueriesConfig.sessionTTLInMs}.
   */
  sessionHistoryQueries: HistoryQuery[];
}
/**
 * HistoryQueries store mutations.
 *
 * @public
 */
export interface HistoryQueriesMutations {
  /**
   * Sets the {@link HistoryQueriesState.historyQueries} property.
   *
   * @param historyQueries - The new {@link HistoryQueriesState.historyQueries}.
   */
  setHistoryQueries(historyQueries: HistoryQuery[]): void;
  /**
   * Sets the {@link HistoryQueriesState.sessionTimeStampInMs } property.
   *
   * @param timeStamp - The new {@link HistoryQueriesState.sessionTimeStampInMs }.
   */
  setSessionTimeStamp(timeStamp: number): void;
  /**
   * Sets the {@link HistoryQueriesState.query } property.
   *
   * @param query - The new {@link HistoryQueriesState.query }.
   */
  setQuery(query: string): void;
}
/**
 * HistoryQueries store actions.
 *
 * @public
 */
export interface HistoryQueriesActions {
  /**
   * Saves a query to the history, synchronizing it with the browser storage. There are 3 possible
   * cases.
   *
   * @example
   * When the query is totally new, it is simply added to the first position of the history.
   * ```ts
   * const = historyQueries ['pork', 'cow'];
   * addQueryToHistory('goat');
   * // historyQueries is now ['goat', 'pork', 'cow'];
   * ```
   *
   * ```ts
   * const = historyQueries ['pork', 'cow'];
   * addQueryToHistory('iberic pork');
   * // historyQueries is now ['iberic pork', 'pork', 'cow'];
   * ```
   *
   * @example
   * When the normalized query equals other one contained in the history or one of its words is
   * more specific, the old one is removed, and the new one is added to the first position of the
   * array. We use the space and dash characters as delimiters for detecting individual words.
   * ```ts
   * const = historyQueries ['tomahack', 'new york st'];
   * addQueryToHistory('new york strip');
   * // historyQueries is now ['new york strip', 'tomahack'];
   * ```
   *
   * ```ts
   * const = historyQueries ['tomahack', 'new york strip'];
   * addQueryToHistory('new york strip');
   * // historyQueries is now ['new york strip', 'tomahack'];
   * ```
   *
   * @example
   * When the query is less specific than the last query, it is not added.
   * ```ts
   * const = historyQueries ['new york strip', 'tomahack'];
   * addQueryToHistory('new york st');
   * // historyQueries is now ['new york strip', 'tomahack'];
   * ```
   *
   * @param query - The query to add to the history.
   */
  addQueryToHistory(query: string): void;
  /**
   * Removes a single query from the history, synchronizing it with the browser storage.
   *
   * @param query - The query to remove.
   */
  removeQueryFromHistory(query: string): void;
  /**
   * Sets the history queries, synchronizing them with the browser storage.
   *
   * @param historyQueries - The new history queries to save to the state and the browser storage.
   */
  setHistoryQueries(historyQueries: HistoryQuery[]): void;
}
/**
 * HistoryQueries type safe store module.
 *
 * @public
 */
export type HistoryQueriesXStoreModule = XStoreModule<
  HistoryQueriesState,
  HistoryQueriesGetters,
  HistoryQueriesMutations,
  HistoryQueriesActions
>;
