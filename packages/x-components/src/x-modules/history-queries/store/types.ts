import { Filter, HistoryQuery } from '@empathyco/x-types';
import { XActionContext, XStoreModule } from '../../../store';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { UrlParams } from '../../../types/url-params';
import { HistoryQueriesConfig } from '../config.types';
import { InternalSearchResponse } from '../../search/index';

/**
 * HistoryQueries store state.
 *
 * @public
 */
export interface HistoryQueriesState extends QueryState {
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
  /**
   * Whether the history queries are enabled or disabled.
   */
  isEnabled: boolean;
}

/**
 * HistoryQueries store getters.
 *
 * @public
 */
export interface HistoryQueriesGetters {
  /**
   * A sub-set of the {@link HistoryQueriesState.historyQueries}. If the
   * {@link HistoryQueriesState.query} property is not empty, this list will only contain
   * suggestions whose query matches with it.
   */
  historyQueries: HistoryQuery[];
  /** The normalized module's query. */
  normalizedQuery: string;
  /**
   * A sub-set of the {@link HistoryQueriesGetters.historyQueries} including only the queries with
   * results at the moment they were requested.
   */
  historyQueriesWithResults: HistoryQuery[];
  /**
   * A list of the queries that have been made in the last period of time specified by
   * {@link HistoryQueriesConfig.sessionTTLInMs}.
   */
  sessionHistoryQueries: HistoryQuery[];
  /**
   * The key for saving the {@link HistoryQueriesState.historyQueries} in the browser storage.
   */
  storageKey: string;
}
/**
 * HistoryQueries store mutations.
 *
 * @public
 */
export interface HistoryQueriesMutations extends QueryMutations {
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
  /**
   * Sets the {@link HistoryQueriesState.isEnabled } property.
   *
   * @param isEnabled - The new {@link HistoryQueriesState.isEnabled }.
   */
  setIsEnabled(isEnabled: boolean): void;
  /**
   * Sets the {@link HistoryQueriesState.historyQueries } filters property.
   *
   * @param filters - The new {@link HistoryQueriesState.historyQueries } filters.
   */
  setSearchSelectedFilters(filters: Filter[]): void;
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
   * Loads the {@link HistoryQueriesState.historyQueries | historyQueries} property from the browser
   * storage.
   */
  loadHistoryQueriesFromBrowserStorage(): void;
  /**
   * Refreshes the current search session, updating its TTL.
   */
  refreshSession(): void;
  /**
   * Removes a single query from the history, synchronizing it with the browser storage.
   *
   * @param historyQuery - The `HistoryQuery` to remove.
   */
  removeFromHistory(historyQuery: HistoryQuery): void;
  /**
   * Sets the history queries, synchronizing them with the browser storage. It also removes the
   * oldest query if the history queries length is bigger than the
   * {@link HistoryQueriesConfig.maxItemsToStore}.
   *
   * @param historyQueries - The new history queries to save to the state and the browser storage.
   */
  setHistoryQueries(historyQueries: HistoryQuery[]): void;
  /**
   * Checks if the url has a query on it and then updates the state with that value.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams(urlParams: UrlParams): void;
  /**
   * Toggles the history queries and stores the state in the browser storage. It also cleans the
   * history queries when disabling them.
   *
   * @param isEnabled - Whether to enable or disable the history queries.
   */
  toggleHistoryQueries(isEnabled: boolean): void;
  /**
   * Updates the history queries with the relevant info included in a search response.
   *
   * @param searchResponse - The search response to update history queries with.
   */
  updateHistoryQueriesWithSearchResponse(searchResponse: InternalSearchResponse): void;
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

/**
 * Alias type for actions context of the {@link HistoryQueriesXStoreModule}.
 *
 * @public
 */
export type HistoryQueriesActionContext = XActionContext<
  HistoryQueriesState,
  HistoryQueriesGetters,
  HistoryQueriesMutations,
  HistoryQueriesActions
>;
