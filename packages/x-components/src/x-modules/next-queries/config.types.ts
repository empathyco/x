/**
 * Configuration options for the {@link NextQueriesXModule}.
 *
 * @public
 */
export interface NextQueriesConfig {
  /**
   * Number of next queries that will be requested.
   */
  maxItemsToRequest: number
  /**
   * Hides the next queries if it has been already searched during the session.
   *
   * @example
   * When set to true:
   * ```
   * query = 'shorts';
   * query = 'trousers';
   * suggestions = ['t-shirt', 'shorts', 'dress']
   * // Suggests ['t-shirt', 'dress']
   * ```
   *
   * @example
   * When set to false:
   * ```
   * query = 'shorts';
   * query = 'trousers';
   * suggestions = ['t-shirt', 'shorts', 'dress']
   * // Suggests ['t-shirt', 'shorts', 'dress']
   * ```
   */
  hideSessionQueries: boolean
  /**
   * Loads the next queries with the last searched query.
   */
  loadOnInit: boolean
  /**
   * Number of results that will be requested to preview the next queries.
   */
  maxPreviewItemsToRequest: number
  /**
   * Delays the next queries requests until a `NextQueries` or `NextQueriesList` component is
   * displayed. Requests made while none is displayed are skipped, and the latest one is made as
   * soon as one is.
   */
  loadWhenVisible?: boolean
}
