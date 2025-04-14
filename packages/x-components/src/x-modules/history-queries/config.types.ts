/**
 * Configuration options for the {@link HistoryQueriesXModule}.
 *
 * @public
 */
export interface HistoryQueriesConfig {
  /**
   * Time in milliseconds for applying a debounce when setting the module query.
   */
  debounceInMs: number
  /**
   * Maximum number of history queries to save in the browser.
   *
   * @example
   * With `maxItemsToStore: 100` and `maxItemsToRender: 5` (HistoryQueries component prop) you are
   * saving last 100 queries, but only showing last 5.
   */
  maxItemsToStore: number
  /**
   * Hides a history query if it is equal to the current query of the module.
   *
   * @example
   * When `hideIfEqualsQuery` is set to `true`, and given the following queries in the history:
   * `ribs`, `ribeye`, `new york strip`, `angus new york strip` and `pork belly`; and the query
   * `new york strip`, the only displayed history query will be `angus new york strip`.
   */
  hideIfEqualsQuery: boolean
  /**
   * Time in milliseconds to keep the session alive. After this time has passed with no user
   * interaction, the session will be cleared.
   */
  sessionTTLInMs: number
}
